(function() {
  var $context = this;
  var root; // root context
  var Helper = {
    is_template: function(str) {
      var re = /\{\{(.+)\}\}/g;
      return re.test(str);
    },
    is_array: function(item) {
      return (
        Array.isArray(item) ||
        (!!item &&
          typeof item === 'object' && typeof item.length === 'number' &&
          (item.length === 0 || (item.length > 0 && (item.length - 1) in item))
        )
      );
    },
    resolve: function(o, path, new_val) {
      // 1. Takes any object
      // 2. Finds subtree based on path
      // 3. Sets the value to new_val
      // 4. Returns the object;
      if (path && path.length > 0) {
        var func = Function('new_val', 'with(this) {this' + path + '=new_val; return this;}').bind(o);
        return func(new_val);
      } else {
        o = new_val;
        return o;
      }
    },
  };
  var Conditional = {
    run: function(template, data) {
      // expecting template as an array of objects,
      // each of which contains '#if', '#elseif', 'else' as key

      // item should be in the format of:
      // {'#if item': 'blahblah'}

      // Step 1. get all the conditional keys of the template first.
      // Step 2. then try evaluating one by one until something returns true
      // Step 3. if it reaches the end, the last item shall be returned
      for (var i = 0; i < template.length; i++) {
        var item = template[i];
        var keys = Object.keys(item);
        // assuming that there's only a single kv pair for each item
        var key = keys[0];
        var func = TRANSFORM.tokenize(key);
        if (func.name === '#if' || func.name === '#elseif') {
          var expression = func.expression;
          var res = TRANSFORM.fillout(data, '{{' + expression + '}}');
          if (res === ('{{' + expression + '}}')) {
            // if there was at least one item that was not evaluatable,
            // we halt parsing and return the template;
            return template;
          } else {
            if (res) {
              // run the current one and return
              return TRANSFORM.run(item[key], data);
            } else {
              // res was falsy. Ignore this branch and go on to the next item
            }
          }
        } else {
          // #else
          // if you reached this point, it means:
          //  1. there were no non-evaluatable expressions
          //  2. Yet all preceding expressions evaluated to falsy value
          //  Therefore we run this branch
          return TRANSFORM.run(item[key], data);
        }
      }
      // if you've reached this point, it means nothing matched.
      // so return null
      return null;
    },
    is: function(template) {
      // TRUE ONLY IF it's in a correct format.
      // Otherwise return the original template
      // Condition 0. Must be an array
      // Condition 1. Must have at least one item
      // Condition 2. Each item in the array should be an object of a single key/value pair
      // Condition 3. starts with #if
      // Condition 4. in case there's more than two items, everything between the first and the last item should be #elseif
      // Condition 5. in case there's more than two items, the last one should be either '#else' or '#elseif'
      if (!Helper.is_array(template)) {
        // Condition 0, it needs to be an array to be a conditional
        return false;
      }
      // Condition 1.
      // Must have at least one item
      if (template.length === 0) {
        return false;
      }
      // Condition 2.
      // Each item in the array should be an object
      // , and  of a single key/value pair
      var containsValidObjects = true;
      for (var i = 0; i < template.length; i++) {
        var item = template[0];
        if (typeof item !== 'object') {
          containsValidObjects = false;
          break;
        }
        if (Object.keys(item).length !== 1) {
          // first item in the array has multiple key value pairs, so invalid.
          containsValidObjects = false;
          break;
        }
      }
      if (!containsValidObjects) {
        return false;
      }
      // Condition 3.
      // the first item should have #if as its key
      // the first item should also contain an expression
      var first = template[0];
      var func;
      for (var key in first) {
        func = TRANSFORM.tokenize(key);
        if (!func) {
          return false;
        }
        if (!func.name) {
          return false;
        }
        // '{{#if }}'
        if (!func.expression || func.expression.length === 0) {
          return false;
        }
        if (func.name.toLowerCase() !== '#if') {
          return false;
        }
      }
      if (template.length === 1) {
        // If we got this far and the template has only one item, it means
        // template had one item which was '#if' so it's valid
        return true;
      }
      // Condition 4.
      // in case there's more than two items, everything between the first and the last item should be #elseif
      var they_are_all_elseifs = true;
      for (var template_index = 1; template_index < template.length-1; template_index++) {
        var template_item = template[template_index];
        for (var template_key in template_item) {
          func = TRANSFORM.tokenize(template_key);
          if (func.name.toLowerCase() !== '#elseif') {
            they_are_all_elseifs = false;
            break;
          }
        }
      }
      if (!they_are_all_elseifs) {
        // There was at least one item that wasn't an elseif
        // therefore invalid
        return false;
      }
      // If you've reached this point, it means we have multiple items and everything between the first and the last item
      // are elseifs
      // Now we need to check the validity of the last item
      // Condition 5.
      // in case there's more than one item, it should end with #else or #elseif
      var last = template[template.length-1];
      for (var last_key in last) {
        func = TRANSFORM.tokenize(last_key);
        if (['#else', '#elseif'].indexOf(func.name.toLowerCase()) === -1) {
          return false;
        }
      }
      // Congrats, if you've reached this point, it's valid
      return true;
    },
  };
  var TRANSFORM = {
    transform: function(template, data, injection, serialized) {
      var selector = null;
      if (/#include/.test(JSON.stringify(template))) {
        selector = function(key, value) { return /#include/.test(key) || /#include/.test(value); };
      }
      var res;
      if (injection) {
        // resolve template with selector
        var resolved_template = SELECT.select(template, selector, serialized)
          .transform(data, serialized)
          .root();
        // apply the resolved template on data
        res = SELECT.select(data, null, serialized)
          .inject(injection, serialized)
          .transformWith(resolved_template, serialized)
          .root();
      } else {
        // no need for separate template resolution step
        // select the template with selector and transform data
        res = SELECT.select(template, selector, serialized)
          .transform(data, serialized)
          .root();
      }
      if (serialized) {
        // needs to return stringified version
        return JSON.stringify(res);
      } else {
        return res;
      }
    },
    tokenize: function(str) {
      // INPUT : string
      // OUTPUT : {name: FUNCTION_NAME:STRING, args: ARGUMENT:ARRAY}
      var re = /\{\{(.+)\}\}/g;
      str = str.replace(re, '$1');
      // str : '#each $jason.items'

      var tokens = str.trim().split(' ');
      // => tokens: ['#each', '$jason.items']

      var func;
      if (tokens.length > 0) {
        if (tokens[0][0] === '#') {
          func = tokens.shift();
          // => func: '#each' or '#if'
          // => tokens: ['$jason.items', '&&', '$jason.items.length', '>', '0']

          var expression = tokens.join(' ');
          // => expression: '$jason.items && $jason.items.length > 0'

          return { name: func, expression: expression };
        }
      }
      return null;
    },
    run: function(template, data) {
      var result;
      var fun;
      if (typeof template === 'string') {
        // Leaf node, so call TRANSFORM.fillout()
        if (Helper.is_template(template)) {
          var include_string_re = /\{\{([ ]*#include)[ ]*([^ ]*)\}\}/g;
          if (include_string_re.test(template)) {
            fun = TRANSFORM.tokenize(template);
            if (fun.expression) {
              // if #include has arguments, evaluate it before attaching
              result = TRANSFORM.fillout(data, '{{' + fun.expression + '}}', true);
            } else {
              // shouldn't happen =>
              // {'wrapper': '{{#include}}'}
              result = template;
            }
          } else {
            // non-#include
            result = TRANSFORM.fillout(data, template);
          }
        } else {
          result = template;
        }
      } else if (Helper.is_array(template)) {
        if (Conditional.is(template)) {
          result = Conditional.run(template, data);
        } else {
          result = [];
          for (var i = 0; i < template.length; i++) {
            var item = TRANSFORM.run(template[i], data);
            if (item) {
              // only push when the result is not null
              // null could mean #if clauses where nothing matched => In this case instead of rendering 'null', should just skip it completely
              // Todo : Distinguish between #if arrays and ordinary arrays, and return null for ordinary arrays
              result.push(item);
            }
          }
        }
      } else if (Object.prototype.toString.call(template) === '[object Object]') {
        // template is an object
        result = {};

        // ## Handling #include
        // This needs to precede everything else since it's meant to be overwritten
        // in case of collision
        var include_object_re = /\{\{([ ]*#include)[ ]*(.*)\}\}/;
        var include_keys = Object.keys(template).filter(function(key) { return include_object_re.test(key); });
        if (include_keys.length > 0) {
        // find the first key with #include
          fun = TRANSFORM.tokenize(include_keys[0]);
          if (fun.expression) {
            // if #include has arguments, evaluate it before attaching
            result = TRANSFORM.fillout(template[include_keys[0]], '{{' + fun.expression + '}}', true);
          } else {
            // no argument, simply attach the child
            result = template[include_keys[0]];
          }
        }

        for (var key in template) {
          // Checking to see if the key contains template..
          // Currently the only case for this are '#each' and '#include'
          if (Helper.is_template(key)) {
            fun = TRANSFORM.tokenize(key);
            if (fun) {
              if (fun.name === '#include') {
                // this was handled above (before the for loop) so just ignore
              } else if (fun.name === '#concat') {
                if (Helper.is_array(template[key])) {
                  result = [];
                  template[key].forEach(function(concat_item) {
                    var res = TRANSFORM.run(concat_item, data);
                    result = result.concat(res);
                  });

                  if (/\{\{(.*?)\}\}/.test(JSON.stringify(result))) {
                    // concat should only trigger if all of its children
                    // have successfully parsed.
                    // so check for any template expression in the end result
                    // and if there is one, revert to the original template
                    result = template;
                  }
                }
              } else if (fun.name === '#merge') {
                if (Helper.is_array(template[key])) {
                  result = {};
                  template[key].forEach(function(merge_item) {
                    var res = TRANSFORM.run(merge_item, data);
                    for (var key in res) {
                      result[key] = res[key];
                    }
                  });
                  // clean up $index from the result
                  // necessary because #merge merges multiple objects into one,
                  // and one of them may be 'this', in which case the $index attribute
                  // will have snuck into the final result
                  if(typeof data === 'object') {
                    delete result["$index"];
                  } else {
                    delete String.prototype.$index;
                    delete Number.prototype.$index;
                    delete Function.prototype.$index;
                    delete Array.prototype.$index;
                    delete Boolean.prototype.$index;
                  }
                }
              } else if (fun.name === '#each') {
                // newData will be filled with parsed results
                var newData = TRANSFORM.fillout(data, '{{' + fun.expression + '}}', true);

                // Ideally newData should be an array since it was prefixed by #each
                if (newData && Helper.is_array(newData)) {
                  result = [];
                  for (var index = 0; index < newData.length; index++) {
                    // temporarily set $index
                    if(typeof newData[index] === 'object') {
                      newData[index]["$index"] = index;
                    } else {
                      String.prototype.$index = index;
                      Number.prototype.$index = index;
                      Function.prototype.$index = index;
                      Array.prototype.$index = index;
                      Boolean.prototype.$index = index;
                    }

                    // run
                    var loop_item = TRANSFORM.run(template[key], newData[index]);

                    // clean up $index
                    if(typeof newData[index] === 'object') {
                      delete newData[index]["$index"];
                    } else {
                      delete String.prototype.$index;
                      delete Number.prototype.$index;
                      delete Function.prototype.$index;
                      delete Array.prototype.$index;
                      delete Boolean.prototype.$index;
                    }

                    if (loop_item) {
                      // only push when the result is not null
                      // null could mean #if clauses where nothing matched => In this case instead of rendering 'null', should just skip it completely
                      result.push(loop_item);
                    }
                  }
                } else {
                  // In case it's not an array, it's an exception, since it was prefixed by #each.
                  // This probably means this #each is not for the current variable
                  // For example {{#each items}} may not be an array, but just leave it be, so
                  // But don't get rid of it,
                  // Instead, just leave it as template
                  // So some other parse run could fill it in later.
                  result = template;
                }
              } // end of #each
            } else { // end of if (fun)
              // If the key is a template expression but aren't either #include or #each,
              // it needs to be parsed
              var k = TRANSFORM.fillout(data, key);
              var v = TRANSFORM.fillout(data, template[key]);
              if (k !== undefined && v !== undefined) {
                result[k] = v;
              }
            }
          } else {
            // Helper.is_template(key) was false, which means the key was not a template (hardcoded string)
            if (typeof template[key] === 'string') {
              fun = TRANSFORM.tokenize(template[key]);
              if (fun && fun.name === '#?') {
                // If the key is a template expression but aren't either #include or #each,
                // it needs to be parsed
                var filled = TRANSFORM.fillout(data, '{{' + fun.expression + '}}');
                if (filled === '{{' + fun.expression + '}}' || !filled) {
                  // case 1.
                  // not parsed, which means the evaluation failed.

                  // case 2.
                  // returns fasly value

                  // both cases mean this key should be excluded
                } else {
                  // only include if the evaluation is truthy
                  result[key] = filled;
                }
              } else {
                var item = TRANSFORM.run(template[key], data);
                if (item !== undefined) {
                  result[key] = item;
                }
              }
            } else {
              var item = TRANSFORM.run(template[key], data);
              if (item !== undefined) {
                result[key] = item;
              }
            }
          }
        }
      } else {
        return template;
      }
      return result;
    },
    fillout: function(data, template, raw) {
      // 1. fill out if possible
      // 2. otherwise return the original
      var replaced = template;
      // Run fillout() only if it's a template. Otherwise just return the original string
      if (Helper.is_template(template)) {
        var re = /\{\{(.*?)\}\}/g;

        // variables are all instances of {{ }} in the current expression
        // for example '{{this.item}} is {{this.user}}'s' has two variables: ['this.item', 'this.user']
        var variables = template.match(re);

        if (variables) {
          if (raw) {
            // 'raw' is true only for when this is called from #each
            // Because #each is expecting an array, it shouldn't be stringified.
            // Therefore we pass template:null,
            // which will result in returning the original result instead of trying to
            // replace it into the template with a stringified version
            replaced = TRANSFORM._fillout({
              variable: variables[0],
              data: data,
              template: null,
            });
          } else {
            // Fill out the template for each variable
            for (var i = 0; i < variables.length; i++) {
              var variable = variables[i];
              replaced = TRANSFORM._fillout({
                variable: variable,
                data: data,
                template: replaced,
              });
            }
          }
        } else {
          return replaced;
        }
      }
      return replaced;
    },
    _fillout: function(options) {
      // Given a template and fill it out with passed slot and its corresponding data
      var re = /\{\{(.*?)\}\}/g;
      var full_re = /^\{\{((?!\}\}).)*\}\}$/;
      var variable = options.variable;
      var data = options.data;
      var template = options.template;
      try {
        // 1. Evaluate the variable
        var slot = variable.replace(re, '$1');

        // data must exist. Otherwise replace with blank
        if (data) {
          var func;
          // Attach $root to each node so that we can reference it from anywhere
          var data_type = typeof data;
          if (['number', 'string', 'array', 'boolean', 'function'].indexOf(data_type === -1)) {
            data.$root = root;
          }
          // If the pattern ends with a return statement, but is NOT wrapped inside another function ([^}]*$), it's a function expression
          var match = /function\([ ]*\)[ ]*\{(.*)\}[ ]*$/g.exec(slot);
          if (match) {
            func = Function('with(this) {' + match[1] + '}').bind(data);
          } else if (/\breturn [^;]+;?[ ]*$/.test(slot) && /return[^}]*$/.test(slot)) {
            // Function expression with explicit 'return' expression
            func = Function('with(this) {' + slot + '}').bind(data);
          } else {
            // Function expression with explicit 'return' expression
            // Ordinary simple expression that
            func = Function('with(this) {return (' + slot + ')}').bind(data);
          }
          var evaluated = func();
          delete data.$root;  // remove $root now that the parsing is over
          if (evaluated) {
            // In case of primitive types such as String, need to call valueOf() to get the actual value instead of the promoted object
            evaluated = evaluated.valueOf();
          }
          if (typeof evaluated === 'undefined') {
            // it tried to evaluate since the variable existed, but ended up evaluating to undefined
            // (example: var a = [1,2,3,4]; var b = a[5];)
            return template;
          } else {
            // 2. Fill out the template with the evaluated value
            // Be forgiving and print any type, even functions, so it's easier to debug
            if (evaluated) {
              // IDEAL CASE : Return the replaced template
              if (template) {
                // if the template is a pure template with no additional static text,
                // And if the evaluated value is an object or an array, we return the object itself instead of
                // replacing it into template via string replace, since that will turn it into a string.
                if (full_re.test(template)) {
                  return evaluated;
                } else {
                  return template.replace(variable, evaluated);
                }
              } else {
                return evaluated;
              }
            } else {
              // Treat false or null as blanks (so that #if can handle it)
              if (template) {
                // if the template is a pure template with no additional static text,
                // And if the evaluated value is an object or an array, we return the object itself instead of
                // replacing it into template via string replace, since that will turn it into a string.
                if (full_re.test(template)) {
                  return evaluated;
                } else {
                  return template.replace(variable, '');
                }
              } else {
                return '';
              }
            }
          }
        }
        // REST OF THE CASES
        // if evaluated is null or undefined,
        // it probably means one of the following:
        //  1. The current data being parsed is not for the current template
        //  2. It's an error
        //
        //  In either case we need to return the original template unparsed.
        //    1. for case1, we need to leave the template alone so that the template can be parsed
        //      by another data set
        //    2. for case2, it's better to just return the template so it's easier to debug
        return template;
      } catch (err) {
        return template;
      }
    },
  };
  var SELECT = {
    // current: currently accessed object
    // path: the path leading to this item
    // filter: The filter function to decide whether to select or not
    $val: null,
    $selected: [],
    $injected: [],
    $progress: null,
    exec: function(current, path, filter) {
      // if current matches the pattern, put it in the selected array
      if (typeof current === 'string') {
        // leaf node should be ignored
        // we're lookin for keys only
      } else if (Helper.is_array(current)) {
        for (var i=0; i<current.length; i++) {
          SELECT.exec(current[i], path+'['+i+']', filter);
        }
      } else {
        // object
        for (var key in current) {
          // '$root' is a special key that links to the root node
          // so shouldn't be used to iterate
          if (key !== '$root') {
            if (filter(key, current[key])) {
              var index = SELECT.$selected.length;
              SELECT.$selected.push({
                index: index,
                key: key,
                path: path,
                object: current,
                value: current[key],
              });
            }
            SELECT.exec(current[key], path+'["'+key+'"]', filter);
          }
        }
      }
    },
    inject: function(obj, serialized) {
      SELECT.$injected = obj;
      try {
        if (serialized) SELECT.$injected = JSON.parse(obj);
      } catch (error) { }

      if (Object.keys(SELECT.$injected).length > 0) {
        SELECT.select(SELECT.$injected);
      }
      return SELECT;
    },
    // returns the object itself
    select: function(obj, filter, serialized) {
      // iterate '$selected'
      //
      /*
      SELECT.$selected = [{
        value {
          '{{#include}}': {
            '{{#each items}}': {
              'type': 'label',
              'text': '{{name}}'
            }
          }
        },
        path: '$jason.head.actions.$load'
        ...
      }]
      */
      var json = obj;
      try {
        if (serialized) json = JSON.parse(obj);
      } catch (error) { }

      if (filter) {
        SELECT.$selected = [];
        SELECT.exec(json, '', filter);
      } else {
        SELECT.$selected = null;
      }

      if (json && (Helper.is_array(json) || typeof json === 'object')) {
        if (!SELECT.$progress) {
          // initialize
          if (Helper.is_array(json)) {
            SELECT.$val = [];
            SELECT.$selected_root = [];
          } else {
            SELECT.$val = {};
            SELECT.$selected_root = {};
          }
        }
        Object.keys(json).forEach(function(key) {
        //for (var key in json) {
          SELECT.$val[key] = json[key];
          SELECT.$selected_root[key] = json[key];
        });
      } else {
        SELECT.$val = json;
        SELECT.$selected_root = json;
      }
      SELECT.$progress = true; // set the 'in progress' flag

      return SELECT;
    },
    transformWith: function(obj, serialized) {
      SELECT.$parsed = [];
      SELECT.$progress = null;
      /*
      *  'selected' is an array that contains items that looks like this:
      *  {
      *    key: The selected key,
      *    path: The path leading down to the selected key,
      *    object: The entire object that contains the currently selected key/val pair
      *    value: The selected value
      *  }
      */
      var template = obj;
      try {
        if (serialized) template = JSON.parse(obj);
      } catch (error) { }

      // Setting $root
      SELECT.$template_root = template;
      String.prototype.$root = SELECT.$selected_root;
      Number.prototype.$root = SELECT.$selected_root;
      Function.prototype.$root = SELECT.$selected_root;
      Array.prototype.$root = SELECT.$selected_root;
      Boolean.prototype.$root = SELECT.$selected_root;
      root = SELECT.$selected_root;
      // generate new $selected_root
      if (SELECT.$selected && SELECT.$selected.length > 0) {
        SELECT.$selected.sort(function(a, b) {
          // sort by path length, so that deeper level items will be replaced first
          // TODO: may need to look into edge cases
          return b.path.length - a.path.length;
        }).forEach(function(selection) {
        //SELECT.$selected.forEach(function(selection) {
          // parse selected
          var parsed_object = TRANSFORM.run(template, selection.object);

          // apply the result to root
          SELECT.$selected_root = Helper.resolve(SELECT.$selected_root, selection.path, parsed_object);

          // update selected object with the parsed result
          selection.object = parsed_object;
        });
        SELECT.$selected.sort(function(a, b) {
          return a.index - b.index;
        });
      } else {
        var parsed_object = TRANSFORM.run(template, SELECT.$selected_root);
        // apply the result to root
        SELECT.$selected_root = Helper.resolve(SELECT.$selected_root, '', parsed_object);
      }
      delete String.prototype.$root;
      delete Number.prototype.$root;
      delete Function.prototype.$root;
      delete Array.prototype.$root;
      delete Boolean.prototype.$root;
      return SELECT;
    },
    transform: function(obj, serialized) {
      SELECT.$parsed = [];
      SELECT.$progress = null;
      /*
      'selected' is an array that contains items that looks like this:

      {
        key: The selected key,
        path: The path leading down to the selected key,
        object: The entire object that contains the currently selected key/val pair
        value: The selected value
      }
      */
      var data = obj;
      try {
        if (serialized) data = JSON.parse(obj);
      } catch (error) { }

      // since we're assuming that the template has been already selected, the $template_root is $selected_root
      SELECT.$template_root = SELECT.$selected_root;

      String.prototype.$root = data;
      Number.prototype.$root = data;
      Function.prototype.$root = data;
      Array.prototype.$root = data;
      Boolean.prototype.$root = data;
      root = data;

      if (SELECT.$selected && SELECT.$selected.length > 0) {
        SELECT.$selected.sort(function(a, b) {
          // sort by path length, so that deeper level items will be replaced first
          // TODO: may need to look into edge cases
          return b.path.length - a.path.length;
        }).forEach(function(selection) {
          // parse selected
          var parsed_object = TRANSFORM.run(selection.object, data);
          // apply the result to root
          SELECT.$template_root = Helper.resolve(SELECT.$template_root, selection.path, parsed_object);
          SELECT.$selected_root = SELECT.$template_root;

          // update selected object with the parsed result
          selection.object = parsed_object;
        });
        SELECT.$selected.sort(function(a, b) {
          return a.index - b.index;
        });
      } else {
        var parsed_object = TRANSFORM.run(SELECT.$selected_root, data);
        // apply the result to root
        SELECT.$template_root = Helper.resolve(SELECT.$template_root, '', parsed_object);
        SELECT.$selected_root = SELECT.$template_root;
      }
      delete String.prototype.$root;
      delete Number.prototype.$root;
      delete Function.prototype.$root;
      delete Array.prototype.$root;
      delete Boolean.prototype.$root;
      return SELECT;
    },

    // Terminal methods
    objects: function() {
      SELECT.$progress = null;
      if (SELECT.$selected) {
        return SELECT.$selected.map(function(item) { return item.object; });
      } else {
        return [SELECT.$selected_root];
      }
    },
    keys: function() {
      SELECT.$progress = null;
      if (SELECT.$selected) {
        return SELECT.$selected.map(function(item) { return item.key; });
      } else {
        if (Array.isArray(SELECT.$selected_root)) {
          return Object.keys(SELECT.$selected_root).map(function(key) { return parseInt(key); });
        } else {
          return Object.keys(SELECT.$selected_root);
        }
      }
    },
    paths: function() {
      SELECT.$progress = null;
      if (SELECT.$selected) {
        return SELECT.$selected.map(function(item) { return item.path; });
      } else {
        if (Array.isArray(SELECT.$selected_root)) {
          return Object.keys(SELECT.$selected_root).map(function(item) {
            // key is integer
            return '[' + item + ']';
          });
        } else {
          return Object.keys(SELECT.$selected_root).map(function(item) {
            // key is string
            return '["' + item + '"]';
          });
        }
      }
    },
    values: function() {
      SELECT.$progress = null;
      if (SELECT.$selected) {
        return SELECT.$selected.map(function(item) { return item.value; });
      } else {
        return Object.values(SELECT.$selected_root);
      }
    },
    root: function() {
      SELECT.$progress = null;
      return SELECT.$selected_root;
    },
  };

  // Native JSON object override
  var _stringify = JSON.stringify;
  JSON.stringify = function(val, replacer, spaces) {
    var t = typeof val;
    if (['number', 'string', 'boolean'].indexOf(t) !== -1) {
      return _stringify(val, replacer, spaces);
    }
    if (!replacer) {
      return _stringify(val, function(key, val) {
        if (SELECT.$injected && SELECT.$injected.length > 0 && SELECT.$injected.indexOf(key) !== -1) { return undefined; }
        if (key === '$root' || key === '$index') {
          return undefined;
        }
        if (typeof val === 'function') {
          return '(' + val.toString() + ')';
        } else {
          return val;
        }
      }, spaces);
    } else {
      return _stringify(val, replacer, spaces);
    }
  };

  // Export
  if (typeof exports !== 'undefined') {
    var x = {
      TRANSFORM: TRANSFORM,
      transform: TRANSFORM,
      SELECT: SELECT,
      Conditional: Conditional,
      Helper: Helper,
      inject: SELECT.inject,
      select: SELECT.select,
      transform: TRANSFORM.transform,
    };
    if (typeof module !== 'undefined' && module.exports) { exports = module.exports = x; }
    exports = x;
  } else {
    $context.ST = {
      select: SELECT.select,
      inject: SELECT.inject,
      transform: TRANSFORM.transform,
    };
  }
}());

(function () {
    "use strict";
    
    angular.module('ngSeApi', []);
})();

(function () {
    "use strict";

    angular.module('ngSeApi').provider('seaConfig', ['$httpProvider',
        function SeaConfigProvider($httpProvider) {
            var config = {
                baseUrl: 'https://api.server-eye.de',
                patchUrl: 'https://patch.server-eye.de',
                pmUrl: 'https://pm.server-eye.de',
                microServiceUrl: 'https://api-ms.server-eye.de',
                apiVersion: 2,
                microServiceApiVersion: 3,
                apiKey: null,
                getUrl: function (path) {
                    return [this.baseUrl, this.apiVersion, path].join('/');
                }
            };

            $httpProvider.interceptors.push(function () {
                return {
                    'request': function (reqConfig) {
                        if (config.apiKey) {
                            reqConfig.headers['x-api-key'] = config.apiKey;
                        }

                        return reqConfig;
                    },

                    'response': function (response) {
                        return response;
                    }
                };
            });

            this.setBaseUrl = function (baseUrl) {
                config.baseUrl = baseUrl;
            }

            this.setPatchUrl = function (patchUrl) {
                config.patchUrl = patchUrl;
            }

            this.setPmUrl = function (pmUrl) {
                config.pmUrl = pmUrl;
            }

            this.setMicroServiceUrl = function (microServiceUrl) {
                config.microServiceUrl = microServiceUrl;
            }

            this.setApiVersion = function (apiVersion) {
                config.apiVersion = apiVersion;
            }

            this.setMicroServiceApiVersion = function (microServiceApiVersion) {
                config.microServiceApiVersion = microServiceApiVersion;
            }

            this.setApiKey = function (apiKey) {
                config.apiKey = apiKey;
            }

            this.$get = function ($http) {
                return {
                    getBaseUrl: function () {
                        return config.baseUrl;
                    },
                    getPatchUrl: function () {
                        return config.patchUrl;
                    },
                    getPmUrl: function () {
                        return config.pmUrl;
                    },
                    getMicroServiceUrl: function () {
                        return config.microServiceUrl;
                    },
                    getMicroServiceUrl: function () {
                        return config.microServiceUrl;
                    },
                    getApiVersion: function () {
                        return config.apiVersion;
                    },
                    getMicroServiceApiVersion: function () {
                        return config.microServiceApiVersion;
                    },
                    getMicroServiceApiVersion: function () {
                        return config.microServiceApiVersion;
                    },
                    getApiKey: function () {
                        return config.apiKey;
                    },
                    setApiKey: function (apiKey) {
                        config.apiKey = apiKey;
                    },
                    getUrl: function (path) {
                        return [config.baseUrl, config.apiVersion, path].join('/');
                    },
                    getMsUrl: function(path) {
                        return [config.microServiceUrl, config.microServiceApiVersion, path].join('/');
                    },
                }
            };
        }]);

    angular.module('ngSeApi').config(['seaConfigProvider',
        function (seaApiConfigProvider) {

        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('SeaRequest', ['seaConfig', '$q', '$http', 'SeaRequestHelperService',
        function SeaRequest(seaConfig, $q, $http, SeaRequestHelperService) {
            function SeaRequest(urlPath, useMicroServiceAPI) {
                this.urlPath = urlPath;
                this.useMicroServiceAPI = !!useMicroServiceAPI;
            }

            /**
             * Merges url and params to a valid api url path.
             *
             * <pre><code>
             * url = '/agent/:aId'
             * params = { aId: 'test-agent-id', name: 'test agent' }
             *
             * url = formatUrl(urlPath, params)
             * url == '/agent/test-agent-id'
             * </pre></code>
             *
             * @param   {String} url    url template
             * @param   {Object} params request parameters
             * @returns {String}
             */
            SeaRequest.prototype.formatUrl = function formatUrl(params, url) {
                url = url || this.urlPath;

                if (url.indexOf('http') < 0) {
                    var urlGetter = (this.useMicroServiceAPI) ? seaConfig.getMsUrl : seaConfig.getUrl;
                    url = urlGetter(url || this.urlPath)
                }

                params = params || {};

                var keys = Object.keys(params),
                    i = keys.length;

                while (i--) {
                    var regex = new RegExp('\\{' + keys[i] + '\\}', 'gm');
                    if (regex.test(url)) {
                        url = url.replace(regex, params[keys[i]]);
                        delete params[keys[i]];
                    }
                }

                url = url.replace(/\/{[a-z0-9]*}/ig, '');

                return url;
            }

            SeaRequest.prototype.send = function send(method, params, urlPath) {
                var deferred = $q.defer(),
                    conf = {
                        method: method
                    };

                params = params || {};
                params = angular.copy(params);

                conf.url = this.formatUrl(params, urlPath);

                if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
                    conf.data = params || {};
                    conf.headers = {
                        'Content-Type': 'application/json'
                    };
                } else {
                    conf.params = params || {};
                }

                SeaRequestHelperService.dumpRequest(conf);

                $http(conf).then(function (resp) {
                    var total = resp.headers('x-total-count');

                    if (total != null) {
                        resp.data.totalCount = total;
                    }

                    deferred.resolve(resp.data);
                }, function (err) {
                    SeaRequestHelperService.dumpResponse(err);
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            /**
             * perform GET request
             * @param {Object}  params  The request parameters
             * @param {String}  urlPath only append if url is different to classes urlPath
             * @returns {Boolean} promise
             */
            SeaRequest.prototype.get = function get(params, urlPath) {
                return this.send('GET', params, urlPath);
            }

            /**
             * perform POST request
             * @param {Object}  params  The request parameters
             * @param {String}  urlPath only append if url is different to classes urlPath
             * @returns {Boolean} promise
             */
            SeaRequest.prototype.post = function get(params, urlPath) {
                return this.send('POST', params, urlPath);
            }

            /**
             * perform PUT request
             * @param {Object}  params  The request parameters
             * @param {String}  urlPath only append if url is different to classes urlPath
             * @returns {Boolean} promise
             */
            SeaRequest.prototype.put = function get(params, urlPath) {
                return this.send('PUT', params, urlPath);
            }

            /**
             * perform DELETE request
             * @param {Object}  params  The request parameters
             * @param {String}  urlPath only append if url is different to classes urlPath
             * @returns {Boolean} promise
             */
            SeaRequest.prototype.del = function get(params, urlPath) {
                return this.send('DELETE', params, urlPath);
            }

            return SeaRequest;
        }]);

    angular.module('ngSeApi').factory('SeaRequestHelperService', [
        function () {
            var dump = {
                request: undefined,
                response: undefined,
            };

            function dumpRequest(data) {
                dump.request = data;
            }

            function dumpResponse(data) {
                dump.response = data;
            }

            function getDump() {
                var dumpData = JSON.stringify(dump);
                dump.request = undefined;
                dump.response = undefined;

                return dumpData;
            }

            return {
                dumpRequest: dumpRequest,
                dumpResponse: dumpResponse,
                getDump: getDump,
            };
        }]);
})();
(function () {
    "use strict";

    var VALID_EVENTS = [
        'USER_UPDATE',
        'NODE_ADD',
        'NODE_UPDATE',
        'NODE_REMOVE',
        'REMOTE_RESULT',
        'user_location_change',
    ];

    angular.module('ngSeApi').factory('seaSocket', ['$rootScope', 'seaConfig',
    function ($rootScope, seaConfig) {
            var connected = false,
                reconnected = false,
                hasEverBeenConnected = false,
                sio;

            var settings = {};

            function fireEvent(name, argsObj) {
                argsObj = argsObj || {};
                console.log('fireEvent', 'se_socket_' + name, argsObj);
                $rootScope.$broadcast('se_socket_' + name, argsObj);
            }

            function connect(credentials, rooms) {
                if (typeof io == 'undefined') {
                    console.error('required socket.io lib not found');
                    return;
                }

                var connectUrl = seaConfig.getBaseUrl();
                
                if(credentials) {
                    connectUrl += Object.keys(credentials).reduce(function (p, key) {
                        p += [ key, credentials[key] ].join('=');
                        return p;
                    }, '?');
                }
                
                sio = io(connectUrl);

                settings.rooms = rooms;

                sio.on('error', onerror);
                sio.on('connect', onconnect);
                sio.on('connecting', function () {
                    console.log('connecting socket');
                });
                sio.on('disconnect', function () {
                    console.log('disconnected socket');
                    onerror('socket.disconnected');
                });
                sio.on('connect_error', function () {
                    console.log('connect socket failed');
                    onerror('socket.connect_failed');
                });
                sio.on('reconnect_error', function () {
                    console.log('reconnect socket failed');
                    onerror('socket.reconnect_failed');
                });
                sio.on('reconnecting', function () {
                    console.log('reconnecting socket');
                });

                sio.on('socket:joined', function (userId, roomId) {
                    console.log(userId, 'joined', roomId);
                });

                // server-eye events
                VALID_EVENTS.forEach(function (evtName) {
                    sio.on(evtName, function (data) {
                        ondata(evtName, data);
                    });
                });
            }

            function sendSettings() {
                sio.emit('settings', settings);
            }

            function onerror(err) {
                console.log('socket error:', err);
                connected = false;
                fireEvent('error', err);
            }

            function onconnect() {
                console.log('connected socket');
                connected = true;

                if (hasEverBeenConnected) {
                    reconnected = true;
                }

                hasEverBeenConnected = true;

                var evt = reconnected ? 'reconnected' : 'connected';

                console.log('firing socket', evt);

                sendSettings();

                fireEvent(evt);
            }

            function ondata(type, data) {
                if(data && data.targetNode) {
                    if(data.targetNode.date) {
                        data.targetNode.date = new Date(data.targetNode.date);
                    }
                    
                    if(data.targetNode.lastDate) {
                        data.targetNode.lastDate = new Date(data.targetNode.lastDate);
                    }
                }
                
                fireEvent(type.toLowerCase(), data);
            }

            return {
                connect: function (credentials, rooms) {
                    return connect(credentials, rooms);
                }
            }
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('SeaTransform', ['SeaTypes',
        function SeaTransform(SeaTypes) {
            function SeaTransform(template) {
                this.parser = ST;
                this.template = template;
            }

            SeaTransform.prototype.parse = function (source) {
                return this.parser.select(angular.extend({}, { SE_TYPES: SeaTypes }, source)).transformWith(this.template).root();
            };

            return SeaTransform;
        }]);
})();

(function () {
    "use strict";

    var TPL_ME_ME = {
        "userId": "{{userId}}",
        "customerId": "{{customer.customerId}}",
        "substitudeId": "",
        "customerNumberExtern": "{{distributor.customerNumberExtern}}",
        "companyName": "",
        "country": "",
        "street": "",
        "streetNumber": "",
        "zipCode": "",
        "city": "",
        "licenseType": "",
        "role": "{{role}}", // needs to be transformed to a number
        "roles": {
            "{{#each roles}}": "{{this.toLowerCase()}}"
        },
        "surname": "{{surname}}",
        "prename": "{{prename}}",
        "email": "{{email}}",
        "phone": "{{phone}}",
        "customerSettings": {},
        "distributor": {
            "id": "{{distributor.customerId}}",
            "customerNumberExtern": "{{distributor.customerNumberExtern}}"
        },
        "distributorInformation": {
            "website": "{{distributor.information.website}}",
            "phone": "{{distributor.information.phone}}",
            "hasLogo": "{{distributor.information.hasLogo}}"
        },
        "settings": {
            "sendSummary": "{{settings.sendSummary}}",
            "defaultNotifyEmail": "{{settings.defaultNotifyEmail}}",
            "defaultNotifyPhone": "{{settings.defaultNotifyPhone}}",
            "defaultNotifyTicket": "{{settings.defaultNotifyTicket}}",
            "timezone": "{{settings.timezone}}",
            "theme": "{{settings.theme}}",
            "webNotification": "{{settings.webNotification}}",
            "highlightCustomers": "{{settings.highlightCustomers}}",
            "defaultViewFilter": "{{settings.defaultViewFilter}}",
            "agreeAnalytics": "{{settings.agreeAnalytics}}"
        },
        "customers": {
            "{{#each $root.managedCustomers}}": {
                "customer_id": "{{customerId}}"
            }
        },
        "isDistributor": "{{isDistributor}}",
        "accessTo": "{{accessTo}}",
        "productVersion": "",
        "hasKeyPair": "{{hasKeyPair}}"
    }

    var TPL_AGENT_STATE_HINT_CREATE = {
        "hintType": "{{ $root.SE_TYPES.LOGNOTE_TYPE.N2S[$root.hintType] }}",
        "message": "{{message}}",
        "assignedUser": "{{assignedUser}}",
        "mentionedUsers": "{{mentionedUsers}}",
        "private": "{{private}}",
        "until": "{{#? until}}",
        "aId": "{{aId}}",
        "sId": "{{sId}}",
    }

    var TPL_CONTAINER_STATE_HINT_CREATE = JSON.parse(JSON.stringify(TPL_AGENT_STATE_HINT_CREATE));
    delete TPL_CONTAINER_STATE_HINT_CREATE["aId"];
    TPL_CONTAINER_STATE_HINT_CREATE["cId"] = "{{cId}}";

    angular.module('ngSeApi').factory('SeaTransformTemplate', [
        function SeaTransformTemplate() {
            return {
                ME: {
                    ME: TPL_ME_ME,
                },
                AGENT: {
                    STATE: {
                        HINT: {
                            CREATE: TPL_AGENT_STATE_HINT_CREATE,
                        },
                    },
                },
                CONTAINER: {
                    STATE: {
                        HINT: {
                            CREATE: TPL_CONTAINER_STATE_HINT_CREATE,
                        },
                    },
                },
            };
        }]);
})();
(function () {
    "use strict";

    var SE_TYPES = {
        ACTION_LOG_TYPE: {
            N2S: {
                0: "AGENT_SETTING",
                1: "AGENT_PROPERTY",
                2: "AGENT_CREATE",
                3: "AGENT_DELETE",
                4: "AGENT_GENERIC",
                22: "AGENT_TAG_ADD",
                23: "AGENT_TAG_REMOVE",
                100: "CONTAINER_SETTING",
                101: "CONTAINER_PROPERTY",
                102: "CONTAINER_CREATE",
                103: "CONTAINER_DELETE",
                104: "CONTAINER_GENERIC",
                105: "CONTAINER_INVENTORY",
                106: "CONTAINER_REMOTEACCESS",
                107: "CONTAINER_REMOTEACCESSPERFORMED",
                108: "CONTAINER_POWERSHELLACCESS",
                109: "CONTAINER_POWERSHELLACCESSPERFORMED",
                110: "CONTAINER_SYSTEMSHUTDOWN",
                122: "CONTAINER_TAG_ADD",
                123: "CONTAINER_TAG_REMOVE",
                202: "NOTE_CREATE",
                203: "NOTE_DELETE",
                300: "NOTIFY_SETTING",
                302: "NOTIFY_CREATE",
                303: "NOTIFY_DELETE",
                310: "NOTIFY_SENT_OK",
                311: "NOTIFY_SENT_ERROR",
                402: "REPORT_CREATE",
                403: "REPORT_DELETE",
                410: "REPORT_TEMPLATE_CHANGE",
                412: "REPORT_TEMPLATE_CREATE",
                413: "REPORT_TEMPLATE_DELETE",
                502: "USER_TWOFACTOR_ENABLE",
                503: "USER_TWOFACTOR_DISABLE",
                600: "COMPLIANCE_CONFIG_CHANGE",
                602: "COMPLIANCE_CONFIG_CREATE",
                603: "COMPLIANCE_CONFIG_DELETE",
                700: "TAG_CHANGE",
                702: "TAG_CREATE",
                703: "TAG_DELETE",
                800: "PM_CONFIG_CHANGE",
                802: "PM_CONFIG_CREATE",
                803: "PM_CONFIG_DELETE",
                900: "VAULT_CREATE",
                901: "VAULT_UPDATE",
                902: "VAULT_DELETE",
                903: "VAULT_RESTORE",
                904: "VAULT_ENTRY_CREATE",
                905: "VAULT_ENTRY_UPDATE",
                906: "VAULT_ENTRY_DELETE",
                907: "VAULT_USER_CREATE",
                908: "VAULT_USER_UPDATE",
                909: "VAULT_USER_DELETE",
                1000: "POWERSHELL_REPOSITORY_CREATE",
                1001: "POWERSHELL_REPOSITORY_UPDATE",
                1002: "POWERSHELL_REPOSITORY_DELETE",
                1003: "POWERSHELL_REPOSITORY_SCRIPT_CREATE",
                1004: "POWERSHELL_REPOSITORY_SCRIPT_UPDATE",
                1005: "POWERSHELL_REPOSITORY_SCRIPT_DELETE",
                1006: "POWERSHELL_REPOSITORY_USER_CREATE",
                1007: "POWERSHELL_REPOSITORY_USER_UPDATE",
                1008: "POWERSHELL_REPOSITORY_USER_DELETE",
                1100: "RMM_SESSION_CREATE",
                1102: "RMM_SESSION_DELETE",
                1200: "SCHEDULED_TASK_CREATE",
                1201: "SCHEDULED_TASK_UPDATE",
                1202: "SCHEDULED_TASK_DELETE",
                1203: "SCHEDULED_TASK_TRIGGER_CREATE",
                1204: "SCHEDULED_TASK_TRIGGER_UPDATE",
                1205: "SCHEDULED_TASK_TRIGGER_DELETE",
            },
            S2N: {
                AGENT_SETTING: 0,
                AGENT_PROPERTY: 1,
                AGENT_CREATE: 2,
                AGENT_DELETE: 3,
                AGENT_GENERIC: 4,
                AGENT_TAG_ADD: 22,
                AGENT_TAG_REMOVE: 23,
                CONTAINER_SETTING: 100,
                CONTAINER_PROPERTY: 101,
                CONTAINER_CREATE: 102,
                CONTAINER_DELETE: 103,
                CONTAINER_GENERIC: 104,
                CONTAINER_INVENTORY: 105,
                CONTAINER_REMOTEACCESS: 106,
                CONTAINER_REMOTEACCESSPERFORMED: 107,
                CONTAINER_POWERSHELLACCESS: 108,
                CONTAINER_POWERSHELLACCESSPERFORMED: 109,
                CONTAINER_SYSTEMSHUTDOWN: 110,
                CONTAINER_TAG_ADD: 122,
                CONTAINER_TAG_REMOVE: 123,
                NOTE_CREATE: 202,
                NOTE_DELETE: 203,
                NOTIFY_SETTING: 300,
                NOTIFY_CREATE: 302,
                NOTIFY_DELETE: 303,
                NOTIFY_SENT_OK: 310,
                NOTIFY_SENT_ERROR: 311,
                REPORT_CREATE: 402,
                REPORT_DELETE: 403,
                REPORT_TEMPLATE_CHANGE: 410,
                REPORT_TEMPLATE_CREATE: 412,
                REPORT_TEMPLATE_DELETE: 413,
                USER_TWOFACTOR_ENABLE: 502,
                USER_TWOFACTOR_DISABLE: 503,
                COMPLIANCE_CONFIG_CHANGE: 600,
                COMPLIANCE_CONFIG_CREATE: 602,
                COMPLIANCE_CONFIG_DELETE: 603,
                TAG_CHANGE: 700,
                TAG_CREATE: 702,
                TAG_DELETE: 703,
                PM_CONFIG_CHANGE: 800,
                PM_CONFIG_CREATE: 802,
                PM_CONFIG_DELETE: 803,
                VAULT_CREATE: 900,
                VAULT_UPDATE: 901,
                VAULT_DELETE: 902,
                VAULT_RESTORE: 903,
                VAULT_ENTRY_CREATE: 904,
                VAULT_ENTRY_UPDATE: 905,
                VAULT_ENTRY_DELETE: 906,
                VAULT_USER_CREATE: 907,
                VAULT_USER_UPDATE: 908,
                VAULT_USER_DELETE: 909,
                POWERSHELL_REPOSITORY_CREATE: 1000,
                POWERSHELL_REPOSITORY_UPDATE: 1001,
                POWERSHELL_REPOSITORY_DELETE: 1002,
                POWERSHELL_REPOSITORY_SCRIPT_CREATE: 1003,
                POWERSHELL_REPOSITORY_SCRIPT_UPDATE: 1004,
                POWERSHELL_REPOSITORY_SCRIPT_DELETE: 1005,
                POWERSHELL_REPOSITORY_USER_CREATE: 1006,
                POWERSHELL_REPOSITORY_USER_UPDATE: 1007,
                POWERSHELL_REPOSITORY_USER_DELETE: 1008,
                RMM_SESSION_CREATE: 1100,
                RMM_SESSION_DELETE: 1102,
                SCHEDULED_TASK_CREATE: 1200,
                SCHEDULED_TASK_UPDATE: 1201,
                SCHEDULED_TASK_DELETE: 1202,
                SCHEDULED_TASK_TRIGGER_CREATE: 1203,
                SCHEDULED_TASK_TRIGGER_UPDATE: 1204,
                SCHEDULED_TASK_TRIGGER_DELETE: 1205
            },
        },
        AGENT_INCARNATION: {
            N2S: {
                0: "AGENT",
                1: "SHADOW",
                2: "DENIED_SHADOW",
                3: "TEMPLATE",
                4: "EXTERNAL",
            },
            S2N: {
                "AGENT": 0,
                "SHADOW": 1,
                "DENIED_SHADOW": 2,
                "TEMPLATE": 3,
                "EXTERNAL": 4,
            },
        },
        APIKEY_TYPE: {
            N2S: {
                0: "USER",
                1: "CUSTOMER",
                2: "CONTAINER",
            },
            S2N: {
                "USER": 0,
                "CUSTOMER": 1,
                "CONTAINER": 2,
            },
        },
        CONTAINER_TYPE: {
            N2S: {
                0: "MAC",
                1: "SECMAC",
                2: "CAC",
                3: "TEMPLATE",
                4: "EXTERNAL",
            },
            S2N: {
                "MAC": 0,
                "SECMAC": 1,
                "CAC": 2,
                "TEMPLATE": 3,
                "EXTERNAL": 4,
            },
        },
        INTERNAL_EVENT: {
            N2S: {
                0: "USER_CHANGE",
                1: "NODE_ADD",
                2: "NODE_UPDATE",
                3: "NODE_REMOVE",
                4: "REMOTE_RESULT",
            },
            S2N: {
                "USER_CHANGE": 0,
                "NODE_ADD": 1,
                "NODE_UPDATE": 2,
                "NODE_REMOVE": 3,
                "REMOTE_RESULT": 4,
            },
        },
        LICENSE_TYPE: {
            N2S: {
                0: "DEACTIVATED",
                1: "DEMO",
                2: "FREEWARE",
                3: "FULL",
            },
            S2N: {
                "DEACTIVATED": 0,
                "DEMO": 1,
                "FREEWARE": 2,
                "FULL": 3,
            },
        },
        NODE_STATUS: {
            N2S: {
                0: "NOT_INITIALIZED",
                1: "SHUTDOWN",
                2: "OK",
                3: "ERROR",
                4: "NO_HEARTBEAT",
                5: "INHERIT",
                6: "WORKING",
            },
            S2N: {
                "NOT_INITIALIZED": 0,
                "SHUTDOWN": 1,
                "OK": 2,
                "ERROR": 3,
                "NO_HEARTBEAT": 4,
                "INHERIT": 5,
                "WORKING": 6,
            },
        },
        NODE_TYPE: {
            N2S: {
                0: "USER",
                1: "CUSTOMER",
                2: "CONTAINER",
                3: "AGENT",
                4: "TEMPLATES",
                5: "TEMPLATE",
                6: "TEMPLATEAGENT",
                7: "CUSTOMERS",
                8: "EXTERNALS",
                9: "EXTERNAL_CONTAINER",
                10: "EXTERNAL_AGENT",
                11: "REPORT",
                12: "REPORT_TEMPLATE",
                13: "COMPLIANCE_CONFIG",
                14: "PM_CONFIG",
                15: "VAULT",
                16: "POWERSHELL_REPOSITORY",
                17: "SCHEDULED_TASK",
            },
            S2N: {
                "USER": 0,
                "CUSTOMER": 1,
                "CONTAINER": 2,
                "AGENT": 3,
                "TEMPLATES": 4,
                "TEMPLATE": 5,
                "TEMPLATEAGENT": 6,
                "CUSTOMERS": 7,
                "EXTERNALS": 8,
                "EXTERNAL_CONTAINER": 9,
                "EXTERNAL_AGENT": 10,
                "REPORT": 11,
                "REPORT_TEMPLATE": 12,
                "COMPLIANCE_CONFIG": 13,
                "PM_CONFIG": 14,
                "VAULT": 15,
                "POWERSHELL_REPOSITORY": 16,
                "SCHEDULED_TASK": 17,
            },
        },
        PUSH_CONTROL: {
            N2S: {
                0: 'ADD_OR_UPDATE_AGENT',
                1: 'DELETE_AGENT',
                2: 'REFRESH_AGENT',
                3: 'UPDATE_CONTAINER',
                4: 'RESTART_CONTAINER',
                5: 'REMOTE_DRIVE',
                6: 'REMOTE_SERVICE',
                7: 'REMOTE_PROCESS',
                8: 'REMOTE_INFORMATION',
                9: 'REMOTE_ACTION',
                10: 'CUSTOM_ACTION',
                11: 'REMOTE_INSTALL',
                12: 'REMOTE_INSTALL2',
                13: 'REMOTE_ACTIVE_DIRECTORY',
                14: 'SHUTDOWN_CONTAINER',
                15: 'REFRESH_ONLINE_PROPERTIES',
                16: 'ADD_OR_UPDATE_TASKS',
            },
            S2N: {
                'ADD_OR_UPDATE_AGENT': 0,
                'DELETE_AGENT': 1,
                'REFRESH_AGENT': 2,
                'UPDATE_CONTAINER': 3,
                'RESTART_CONTAINER': 4,
                'REMOTE_DRIVE': 5,
                'REMOTE_SERVICE': 6,
                'REMOTE_PROCESS': 7,
                'REMOTE_INFORMATION': 8,
                'REMOTE_ACTION': 9,
                'CUSTOM_ACTION': 10,
                'REMOTE_INSTALL': 11,
                'REMOTE_INSTALL2': 12,
                'REMOTE_ACTIVE_DIRECTORY': 13,
                'SHUTDOWN_CONTAINER': 14,
                'REFRESH_ONLINE_PROPERTIES': 15,
                'ADD_OR_UPDATE_TASKS': 16,
            },
        },
        LOGNOTE_TYPE: {
            N2S: {
                0: "WORKING",
                1: "REOPEN",
                2: "FALSE_ALERT",
                3: "HINT",
                4: "CHANGE",
            },
            S2N: {
                "WORKING": 0,
                "REOPEN": 1,
                "FALSE_ALERT": 2,
                "HINT": 3,
                "CHANGE": 4,
            },
        },
        USER_ROLE: {
            N2S: {
                0: "ADMIN",
                1: "USER",
                2: "LEAD",
                3: 'INSTALLER',
                4: 'ARCHITECT',
                5: 'TECHIE',
                6: 'HINTER',
                7: 'HR',
                8: 'REPORTING',
                9: 'MAV',
                10: 'PM',
                11: 'PCVISIT',
                12: 'POWERSHELL',
                13: 'TANSS',
                14: 'RMM',
                15: 'TASKS',
            },
            S2N: {
                ADMIN: 0,
                USER: 1,
                LEAD: 2,
                INSTALLER: 3,
                ARCHITECT: 4,
                TECHIE: 5,
                HINTER: 6,
                HR: 7,
                REPORTING: 8,
                MAV: 9,
                PM: 10,
                PCVISIT: 11,
                POWERSHELL: 12,
                TANSS: 13,
                RMM: 14,
                TASKS: 15,
            },
        },
    }

    angular.module('ngSeApi').factory('SeaTypes', [
        function () {
            return SE_TYPES;
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAuth', ['SeaRequest', 'seaConfig', 'SeaTransform', 'SeaTransformTemplate',
        function seaAuth(SeaRequest, seaConfig, SeaTransform, SeaTransformTemplate) {
            var request = new SeaRequest('auth/{action}');
            var requestMicroService = new SeaRequest('auth/{action}', 'v3');

            function createApiKey(params) {
                params = params || {};
                params.action = 'key';

                return request.post(params);
            }

            function login(params) {
                params = params || {};
                params.action = 'login';

                return request.post(params);
            }

            function logout(params) {
                params = params || {};
                params.action = 'logout';

                return request.get(params);
            }

            function requestResetLink(params) {
                params = params || {};
                params.action = 'reset';

                return request.get(params);
            }

            function resetPassword(params) {
                params = params || {};
                params.action = 'reset';

                return request.post(params);
            }

            function token(params) {
                params = params || {};
                params.action = 'token';

                return requestMicroService.post(params);
            }

            return {
                /**
                 * create apiKey
                 * @param {Object} params
                 * @config {String} [email]
                 * @config {String} [password]
                 * @config {Number} [type]
                 * @config {Number} [validUntil]
                 * @config {Number} [maxUses]
                 */
                createApiKey: function (params) {
                    return createApiKey(params);
                },

                /**
                 * login
                 * @param {Object} params
                 * @config {String} [apiKey]
                 * @config {String} [email]
                 * @config {String} [password]
                 * @config {Boolean} [createApiKey]
                 * @config {String} [apiKeyName]
                 */
                login: function (params) {
                    return login(params);
                },

                logout: function () {
                    return logout();
                },

                requestResetLink: function (params) {
                    return requestResetLink(params);
                },

                resetPassword: function (params) {
                    return resetPassword(params);
                },

                token: function (params) {
                    return token(params);
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainer', ['SeaRequest',
                                                   'seaContainerMisc', 'seaContainerNote', 'seaContainerNotification',
                                                   'seaContainerProposal', 'seaContainerState', 'seaContainerTag', 'seaContainerTemplate',
    function seaContainer(SeaRequest, seaContainerMisc, seaContainerNote, seaContainerNotification, seaContainerProposal, seaContainerState, seaContainerTag, seaContainerTemplate) {
            var request = new SeaRequest('container/{cId}/{action}');
            var multiRequest = new SeaRequest('container/{action}');

            function formatContainer(container) {
                if (container.lastBootUpTime) {
                    container.lastBootUpTime = new Date(container.lastBootUpTime);
                }
                return container;
            }

            function get(cId) {
                return request.get({
                    cId: cId
                }).then(formatContainer);
            }
        
            function listAgents(cId) {
                return request.get({
                    cId: cId,
                    action: 'agents'
                });
            }

            function listProposals(cId) {
                return multiRequest.post({
                    cId: cId,
                    action: 'proposal'
                });
            }

            function update(container) {
                return request.put(container);
            }

            function destroy(cId) {
                return request.del({
                    cId: cId
                });
            }

            var api = {
                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update container
                 * @param {Object} container
                 * @config {String} [cId]
                 * @config {String} [name]
                 * @config {Boolean} [alertOffline]
                 * @config {Boolean} [alertShutdown]
                 * @config {Number} [maxHeartbeatTimeout]
                 */
                update: function (container) {
                    return update(container);
                },

                destroy: function (cId) {
                    return destroy(cId);
                },
                
                agent: {
                    list: function (cId) {
                        return listAgents(cId);
                    }
                },

                note: seaContainerNote,
                notification: seaContainerNotification,
                proposal: seaContainerProposal,
                state: seaContainerState,
                tag: seaContainerTag,
                template: seaContainerTemplate,
                listProposals: listProposals,
            };
                
            angular.extend(api, seaContainerMisc);
        
            return api;
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerMisc', ['SeaRequest',
        function seaContainerMisc(SeaRequest) {
            var request = new SeaRequest('container/{cId}/{action}');
            var requestMicroService = new SeaRequest('container/{cId}/{action}', 'v3');

            function formatActionlog(entry) {
                entry.changeDate = new Date(entry.changeDate);
                entry.changed = JSON.parse(entry.changed);
                try {
                    entry.userName = JSON.parse(entry.userName);
                } catch (e) {
                    entry.userName = {
                        email: entry.userName,
                        sur: entry.userName
                    };
                }

                if (entry.information) {
                    try {
                        entry.information = JSON.parse(entry.information);
                    } catch (e) {
                        entry.information = null;
                    }
                }

                return entry;
            }

            function listActionlog(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'actionlog';
                return request.get(params);
            }

            function listEvents(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'events';
                return request.get(params);
            }

            function getInventory(cId, params) {
                params = params || {};
                params.cId = cId;
                params.action = 'inventory';
                return request.get(params);
            }

            function action(cId, action, params) {
                params = params || {};
                params.cId = cId;
                params.action = action;
                return requestMicroService.post(params);
            }

            return {
                actionlog: {
                    /**
                     * list action log entries
                     * @param   {String} cId
                     * @param   {Object} params
                     * @config  {Number} [start]
                     * @config  {Number} [limit]
                     * @returns {Object} promise
                     */
                    list: function (cId, params) {
                        return listActionlog(cId, params).then(function (entries) {
                            angular.forEach(entries, formatActionlog);

                            return entries;
                        });
                    }
                },

                events: {
                    /**
                     * list action log entries
                     * @param   {String} cId
                     * @param   {Object} params
                     * @config  {Number} start
                     * @config  {Number} end
                     * @returns {Object} promise
                     */
                    list: function (cId, params) {
                        return listEvents(cId, params);
                    }
                },

                inventory: {
                    /**
                     * get inventory of the container
                     * @param   {String}   cId
                     * @param   {String}   params
                     * @config {String} [format]
                     * @returns {Object} promise
                     */
                    get: function (cId, params) {
                        return getInventory(cId, params);
                    },

                    getFileLink: function (cId, params) {
                        params = params || {};
                        params.cId = cId;
                        params.action = 'inventory';

                        return request.formatUrl(params);
                    }
                },

                /**
                 * restart a container
                 * @param   {String} cId
                 * @returns {Object} promise
                 */
                restart: function (cId) {
                    return action(cId, 'restart');
                },

                /**
                 * stop a container
                 * @param   {String} cId
                 * @param   {Int}    until timestamp
                 * @returns {Object} promise
                 */
                stop: function (cId, until) {
                    return action(cId, 'stop', {
                        until: until
                    });
                },

                /**
                 * start a container
                 * @param   {String} cId
                 * @returns {Object} promise
                 */
                start: function (cId) {
                    return action(cId, 'start');
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerNote', ['SeaRequest',
    function seaContainerNote(SeaRequest) {
            var request = new SeaRequest('container/{cId}/note/{nId}');
            var requestMicroService = new SeaRequest('container/{cId}/note/{nId}', 'v3')

            function formatNote(note) {
                note.postedOn = new Date(note.postedOn);
                return note;
            }

            function create(params) {
                return requestMicroService.post(params).then(formatNote);
            }

            function list(cId) {
                return request.get({
                    cId: cId
                }).then(function (notes) {
                    angular.forEach(notes, formatNote);

                    return notes;
                });
            }

            function count(cId) {
                return request.get({
                    cId: cId,
                    nId: 'count'
                });
            }
        
            function destroy(cId, nId) {
                return requestMicroService.del({
                    cId: cId,
                    nId: nId
                });
            }

            return {
                /**
                 * create note
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [message]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function (cId) {
                    return list(cId);
                },
                
                count: function (cId) {
                    return count(cId);
                },

                destroy: function (cId, nId) {
                    return destroy(cId, nId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerNotification', ['SeaRequest',
    function seaContainerNotification(SeaRequest) {
            var request = new SeaRequest('container/{cId}/notification/{nId}');
            var requestMicroService = new SeaRequest('container/{cId}/notification/{nId}', 'v3');

            function create(params) {
                return request.post(params);
            }

            function update(notification) {
                return requestMicroService.put(notification);
            }

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function destroy(cId, nId) {
                return request.del({
                    cId: cId,
                    nId: nId
                });
            }

            return {
                /**
                 * create notification
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [userId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                create: function (params) {
                    return create(params);
                },

                /**
                 * update notification
                 * @param {Object} params
                 * @config {String} [nId]
                 * @config {String} [cId]
                 * @config {String} [userId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                update: function (notification) {
                    return update(notification);
                },

                list: function (cId) {
                    return list(cId);
                },

                destroy: function (cId, nId) {
                    return destroy(cId, nId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerProposal', ['SeaRequest',
    function seaContainerProposal(SeaRequest) {
            var request = new SeaRequest('container/{cId}/proposal/{pId}');
            var requestMicroService = new SeaRequest('container/{cId}/proposal/{pId}', 'v3');

            function accept(cId, pId) {
                return request.put({
                    cId: cId,
                    pId: pId
                });
            }

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function deny(cId, pId) {
                return requestMicroService.del({
                    cId: cId,
                    pId: pId
                });
            }

            function listSettings(cId, pId) {
                return request.get({
                    cId: cId,
                    pId: pId
                }, 'container/{cId}/proposal/{pId}/setting');
            }

            return {
                accept: function (cId, pId) {
                    return accept(cId, pId);
                },

                list: function (cId) {
                    return list(cId);
                },

                deny: function (cId, pId) {
                    return deny(cId, pId);
                },

                settings: {
                    list: function (cId, pId) {
                        return listSettings(cId, pId);
                    }
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerState', ['SeaRequest', 'SeaTransform', 'SeaTransformTemplate',
        function seaContainerState(SeaRequest, SeaTransform, SeaTransformTemplate) {
            var request = new SeaRequest('container/{cId}/state/{method}'),
                stateRequest = new SeaRequest('container/{cId}/state/{sId}'),
                hintRequest = new SeaRequest('container/{cId}/state/{sId}/hint');
            var requestMicroService = new SeaRequest('container/{cId}/state/{method}', 'v3'),
                stateRequestMicroService = new SeaRequest('container/{cId}/state/{sId}', 'v3'),
                hintRequestMicroService = new SeaRequest('container/{cId}/state/{sId}/hint', 'v3');

            function formatState(state) {
                state.date = new Date(state.date);
                state.lastDate = new Date(state.lastDate);

                if (state.silencedUntil) {
                    state.silencedUntil = new Date(state.silencedUntil);
                }

                if (state.hints) {
                    angular.forEach(state.hints, formatHint);
                }

                return state;
            }

            function formatHint(hint) {
                hint.date = new Date(hint.date);

                if (hint.until) {
                    hint.until = new Date(hint.until);
                }

                return hint;
            }

            function hint(params) {
                var parser = new SeaTransform(SeaTransformTemplate.CONTAINER.STATE.HINT.CREATE);
                var paramsParsed = parser.parse(params);

                return hintRequestMicroService.post(paramsParsed).then(formatHint);
            }

            function stats(cId, params) {
                params = params || {};
                params.cId = cId;
                params.method = 'stats';

                return request.get(params);
            }

            function list(cId, params) {
                params = params || {};
                params.cId = cId;

                if (angular.isArray(params.cId)) {
                    return request.post(params, 'container/state').then(function (statesById) {
                        if (angular.isArray(statesById)) {
                            var n = {};
                            n[params.cId[0]] = statesById;
                            statesById = n;
                        }

                        angular.forEach(Object.keys(statesById), function (key) {
                            angular.forEach(statesById[key], formatState);
                        });

                        return statesById;
                    });
                }
                return request.get(params).then(function (states) {
                    angular.forEach(states, formatState);

                    return states;
                });
            }

            function get(cId, sId, params) {
                params = params || {};
                params.sId = sId;
                params.cId = cId;

                return stateRequest.get(params).then(function (state) {
                    return formatState(state);
                });
            }

            return {
                /**
                 * create container state hint
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [sId]
                 * @config {String} [author]
                 * @config {Number} [hintType]
                 * @config {String} [message]
                 * @config {String} [assignedUser]
                 * @config {Array} [mentionedUsers]
                 * @config {Boolean} [private]
                 * @config {Number} [until]
                 */
                hint: function (params) {
                    return hint(params);
                },

                /**
                 * list container states
                 * @param   {String}   cId
                 * @param {Object}
                 * @config {Number} [limit]
                 * @config {Number} [start]
                 * @config {Number} [end]
                 * @config {Boolean} [includeHints]
                 * @config {Boolean} [includeRawData]
                 * @config {String} [format]
                 */
                list: function (cId, params) {
                    return list(cId, params);
                },

                /**
              * get state by Id
              * @param   {String}   cId
              * @param   {String}   sId
              * @param {Object}
              * @config {Boolean} [includeHints]
              * @config {Boolean} [includeMessage]
              * @config {Boolean} [includeRawData]
              * @config {String} [format]
              */
                get: function (cId, sId, params) {
                    return get(cId, sId, params);
                },

                /**
                 * list container state stats
                 * @param   {String}   cId
                 * @param {Object}
                 * @config {Number} [start] : now
                 * @config {Number} [end]   : now - 12 months
                 */
                stats: function (cId, params) {
                    return stats(cId, params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerTag', ['SeaRequest',
    function seaAgentNote(SeaRequest) {
            var request = new SeaRequest('container/{cId}/tag/{tId}');

            function create(params) {
                return request.put(params);
            }

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function destroy(cId, tId) {
                return request.del({
                    cId: cId,
                    tId: tId
                });
            }

            return {
                /**
                 * add tag to container
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [tId]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function (cId) {
                    return list(cId);
                },

                destroy: function (cId, tId) {
                    return destroy(cId, tId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaContainerTemplate', ['SeaRequest',
    function seaContainerTemplate(SeaRequest) {
            var request = new SeaRequest('container/{cId}/template/{tId}');
            var requestMicroService = new SeaRequest('container/{cId}/template/{tId}', 'v3');

            function create(cId) {
                return requestMicroService.post({
                    cId: cId
                });
            }

            function assign(cId, tId) {
                return request.post({
                    cId: cId,
                    tId: tId
                });
            }

            return {
                /**
                 * create template form system
                 * @param {String} cId
                 */
                create: function (cId) {
                    return create(cId);
                },

                /**
                 * assign a template to a system
                 * @param {String} cId
                 * @param {String} tId
                 */
                assign: function (cId, tId) {
                    return assign(cId, tId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeLocation', ['SeaRequest',
        function seaMeLocation(SeaRequest) {
            var request = new SeaRequest('me/location');

            function get() {
                return request.get();
            }

            function update(params) {
                return request.post(params);
            }

            return {
                /**
                 * get location
                 */
                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update location
                 * @param {Object} params
                 * @config {Object} [geo]
                 * @config {Number} [geo.lat]
                 * @config {Number} [geo.lon]
                 * @config {Object} [geo.address]
                 * @config {String} [geo.address.country]
                 * @config {String} [geo.address.state]
                 * @config {String} [geo.address.postcode]
                 * @config {String} [geo.address.city]
                 * @config {String} [geo.address.road]
                 * @config {String} [geo.address.house_number]
                 */
                update: function (params) {
                    return update(params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMe', ['SeaRequest', 'seaMeLocation', 'seaMeMobilepush', 'seaMeNotification', 'seaMeTwoFactor', 'seaMeSetting',
        function seaMe(SeaRequest, seaMeLocation, seaMeMobilepush, seaMeNotification, seaMeTwoFactor, seaMeSetting) {
            var request = new SeaRequest('me/{action}');
            var requestMicroService = new SeaRequest('me/{action}', 'v3');

            function _formatNode(node) {
                ['date', 'lastDate', 'silencedUntil'].forEach(function (key) {
                    if (node[key] && typeof (node[key]) === 'string') {
                        node[key] = new Date(node[key]);
                    }
                });

                return node;
            }

            function _formatData(data) {
                var idx = data.indexOf('loadfinish');
                if (idx >= 0) {
                    data.splice(idx, 1);
                }

                for (var i = 0, len = data.length; i < len; i++) {
                    _formatNode(data[i]);
                }

                return data;
            }

            function me() {
                return request.get();
            }

            function customer() {
                return request.get({
                    action: 'customer'
                });
            }

            function feed(params) {
                params = params || {};
                params.action = 'feed';

                return request.get(params);
            }

            function key(name) {
                return request.get({
                    action: 'key',
                    name: name
                });
            }

            function nodes(params) {
                params = params || {};
                params.action = 'nodes';

                return request.get(params).then(_formatData);
            }

            function updatePassword(params) {
                params = angular.extend({}, { action: 'password' }, params);
                return requestMicroService.put(params);
            }

            return {
                me: me,
                password: {
                    update: function (params) {
                        return updatePassword(params);
                    },
                },
                customer: customer,
                feed: function (params) {
                    return feed(params);
                },
                key: function (name) {
                    return key(name);
                },
                nodes: function (params) {
                    return nodes(params);
                },

                location: seaMeLocation,
                mobilepush: seaMeMobilepush,
                notification: seaMeNotification,
                twofactor: seaMeTwoFactor,
                setting: seaMeSetting
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeMobilepush', ['SeaRequest',
    function seaMeMobilepush(SeaRequest) {
            var request = new SeaRequest('me/mobilepush/{handle}');
            var requestMicroService = new SeaRequest('me/mobilepush/{handle}', 'v3');

            function list() {
                return request.get();
            }

            function create(params) {
                return requestMicroService.post(params);
            }

            function get(handle) {
                return request.get({
                    handle: handle
                });
            }

            function destroy(handle) {
                return requestMicroService.del({
                    handle: handle
                });
            }

            return {
                list: list,

                /**
                 * add mobilepush
                 * @param   {Object} params
                 * @config  {String} handle
                 * @config  {String} type
                 * @returns {Object} promise
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (handle) {
                    return get(handle);
                },

                destroy: function (handle) {
                    return destroy(handle);
                }
            };
  }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeNotification', ['SeaRequest',
    function seaMeNotification(SeaRequest) {
            var request = new SeaRequest('me/notification/{nId}');
            var requestMicroService = new SeaRequest('me/notification/{nId}', 'v3');

            function list(params) {
                return request.get(params);
            }

            function update(notification) {
                return requestMicroService.put(notification);
            }

            function destroy(nId) {
                return requestMicroService.del({
                    nId: nId
                });
            }

            return {
                /**
                 * list all notifications
                 * @param   {Object} params
                 * @config  {Boolean}  type
                 * @returns {Object} promise
                 */
                list: function (params) {
                    return list(params);
                },

                /**
                 * update notification
                 * @param {Object} params
                 * @config {String} [nId]
                 * @config {String} [cId || aId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                update: function (notification) {
                    return update(notification);
                },

                destroy: function (nId) {
                    return destroy(nId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeSetting', ['SeaRequest',
    function seaMeSetting(SeaRequest) {
            var request = new SeaRequest('me/setting');
            var requestAction = new SeaRequest('me/setting/{action}');
            var requestMicroService = new SeaRequest('me/setting', 'v3');
            var requestActionMicroService = new SeaRequest('me/setting/{action}', 'v3');

            function list() {
                return request.get();
            }

            function update(settings) {
                settings = settings || {};
                return requestMicroService.put(settings);
            }

            function resetSecret(password) {
                return requestActionMicroService.post({
                    action: 'secret/reset',
                    password: password,
                });
            }

            return {
                list: function (uId) {
                    return list(uId);
                },

                /**
                 * update user
                 * @param {Object} settings
                 */
                update: function (settings) {
                    return update(settings);
                },

                secret: {
                    reset: function(password) {
                        return resetSecret(password);
                    }
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaMeTwoFactor', ['SeaRequest',
        function seaMeLocation(SeaRequest) {
            var request = new SeaRequest('me/twofactor/{sub}');
            var requestMicroService = new SeaRequest('me/twofactor/{sub}', 'v3');

            function get() {
                return request.get();
            }

            function getSecret(params) {
                params = params || {};
                params.sub = 'secret';
                return request.get(params);
            }

            function enable(params) {
                return requestMicroService.post(params);
            }

            function disable(params) {
                return requestMicroService.del(params);
            }

            return {
                /**
                 * is two-factor enabled
                 */
                isEnabled: function () {
                    return get();
                },

                /**
                 * enable two-factor authentication
                 * @param   {Object} params
                 * @config  {string}  format
                 * @returns {Object} promise
                 */
                getSecret: function (params) {
                    return getSecret(params);
                },

                /**
                 * enable two-factor authentication
                 * @param   {Object} params
                 * @config  {string}  password
                 * @config  {string}  code
                 * @returns {Object} promise
                 */
                enable: function (params) {
                    return enable(params);
                },

                /**
                 * disable two-factor authentication
                 * @param   {Object} params
                 * @config  {string}  password
                 * @config  {string}  code
                 * @returns {Object} promise
                 */
                disable: function (params) {
                    return disable(params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerApiKey', ['SeaRequest',
        function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/apiKey/{apiKey}'),
                requestDistri = new SeaRequest('customer/apiKey/{apiKey}');
            var requestMicroService = new SeaRequest('customer/{cId}/apiKey/{apiKey}', 'v3');

            function format(apiKey) {
                if (apiKey.validUntil) {
                    apiKey.validUntil = new Date(apiKey.validUntil);
                }

                if (apiKey.createdOn) {
                    apiKey.createdOn = new Date(apiKey.createdOn);
                }

                return apiKey;
            }

            function list(cId) {
                var p;

                if (!cId) {
                    p = requestDistri.get();
                } else {
                    p = request.get({
                        cId: cId
                    });
                }

                return p.then(function (apiKeys) {
                    angular.forEach(apiKeys, format);

                    return apiKeys;
                });
            }

            function get(cId, query) {
                query = query || {};
                query.cId = cId;

                return request.get(query).then(format);
            }

            function destroy(cId, apiKey) {
                return requestMicroService.del({
                    cId: cId,
                    apiKey: apiKey
                });
            }

            return {
                /**
                 * list all api keys of a customer or all your customers
                 * @param   {String} cId empty or customerId
                 */
                list: function (cId) {
                    return list(cId);
                },

                get: function (cId, query) {
                    return get(cId, query);
                },

                destroy: function (cId, apiKey) {
                    return destroy(cId, apiKey);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerBucket', ['SeaRequest',
        function seaCustomerDispatchTime(SeaRequest) {
            var request = new SeaRequest('customer/bucket/{bId}'),
                userRequest = new SeaRequest('customer/bucket/{bId}/user/{uId}');
            var requestMicroService = new SeaRequest('customer/bucket/{bId}', 'v3'),
                userRequestMicroService = new SeaRequest('customer/bucket/{bId}/user/{uId}', 'v3');

            function create(params) {
                return requestMicroService.post(params);
            }

            function list() {
                return request.get();
            }

            function update(bucket) {
                return request.put(bucket);
            }

            function destroy(bId) {
                return requestMicroService.del({
                    bId: bId
                });
            }

            function listUser(bId) {
                return userRequest.get({
                    bId: bId
                });
            }

            function addUser(params) {
                return userRequestMicroService.put(params);
            }

            function removeUser(bId, uId) {
                return userRequestMicroService.del({
                    bId: bId,
                    uId: uId
                });
            }

            return {
                /**
                 * create bucket
                 * @param {Object} params
                 * @config {String} [name]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function () {
                    return list();
                },

                /**
                 * update bucket
                 * @param {Object} params
                 * @config {String} [bId]
                 * @config {String} [name]
                 */
                update: function (bucket) {
                    return update(bucket);
                },

                destroy: function (bId) {
                    return destroy(bId);
                },

                user: {
                    list: function (bId) {
                        return listUser(bId);
                    },

                    /**
                     * add user to bucket
                     * @param {Object} params
                     * @config {String} [bId]
                     * @config {String} [uId]
                     */
                    create: function (params) {
                        return addUser(params);
                    },

                    /**
                     * remove user from bucket
                     * @param {String} [bId]
                     * @param {String} [uId]
                     */
                    destroy: function (bId, uId) {
                        return removeUser(bId, uId);
                    }
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomer', ['SeaRequest', 'seaCustomerApiKey', 'seaCustomerBucket', 'seaCustomerDispatchTime', 'seaCustomerExternalCall', 'seaCustomerLocation', 'seaCustomerManager', 'seaCustomerProperty', 'seaCustomerSetting', 'seaCustomerTag', 'seaCustomerTemplate', 'seaCustomerUsage', 'seaCustomerViewFilter',
        function seaCustomer(SeaRequest, seaCustomerApiKey, seaCustomerBucket, seaCustomerDispatchTime, seaCustomerExternalCall, seaCustomerLocation, seaCustomerManager, seaCustomerProperty, seaCustomerSetting, seaCustomerTag, seaCustomerTemplate, seaCustomerUsage, seaCustomerViewFilter) {
            var request = new SeaRequest('customer/{cId}');
            var requestMicroService = new SeaRequest('customer/{cId}', 'v3');

            function list() {
                return request.get();
            }

            function get(cId) {
                return request.get({
                    cId: cId
                });
            }

            function update(customer) {
                return requestMicroService.put(customer);
            }
            
            function create(customer) {
                return requestMicroService.post(customer);
            }

            return {
                list: function () {
                    return list();
                },

                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update customer
                 * @param {Object} customer
                 * @config {String} [country]
                 * @config {Number} [customerNumberIntern]
                 * @config {Number} [customerNumberExtern]
                 * @config {String} [companyName]
                 * @config {String} [street]
                 * @config {String} [zipCode]
                 * @config {String} [city]
                 * @config {String} [email]
                 * @config {String} [phone]
                 */
                create: function (customer) {
                    return create(customer);
                },

                /**
                 * update customer
                 * @param {Object} customer
                 * @config {String} [cId]
                 * @config {String} [country]
                 * @config {Number} [customerNumberIntern]
                 * @config {Number} [customerNumberExtern]
                 * @config {String} [companyName]
                 * @config {String} [street]
                 * @config {String} [zipCode]
                 * @config {String} [city]
                 * @config {String} [email]
                 * @config {String} [phone]
                 */
                update: function (customer) {
                    return update(customer);
                },

                apiKey: seaCustomerApiKey,
                bucket: seaCustomerBucket,
                dispatchTime: seaCustomerDispatchTime,
                externalCall: seaCustomerExternalCall,
                location: seaCustomerLocation,
                manager: seaCustomerManager,
                property: seaCustomerProperty,
                setting: seaCustomerSetting,
                tag: seaCustomerTag,
                template: seaCustomerTemplate,
                usage: seaCustomerUsage,
                viewFilter: seaCustomerViewFilter
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerDispatchTime', ['SeaRequest',
    function seaCustomerDispatchTime(SeaRequest) {
            var request = new SeaRequest('customer/dispatchTime/{dtId}');
            var requestMicroService = new SeaRequest('customer/dispatch-time/{dtId}', 'v3');

            function create(params) {
                return requestMicroService.post(params);
            }

            function list() {
                return request.get();
            }

            function update(dispatchTime) {
                return requestMicroService.put(dispatchTime);
            }

            function destroy(dtId) {
                return requestMicroService.del({
                    dtId: dtId
                });
            }

            return {
                /**
                 * create dispatchTime
                 * @param {Object} params
                 * @config {String} [name]
                 * @config {Number} [defer]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function () {
                    return list();
                },

                /**
                 * update dispatchTime
                 * @param {Object} params
                 * @config {String} [dtId]
                 * @config {String} [name]
                 * @config {Number} [defer]
                 */
                update: function (dispatchTime) {
                    return update(dispatchTime);
                },

                destroy: function (dtId) {
                    return destroy(dtId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerExternalCall', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var requestDistri = new SeaRequest('customer/externalCall');

            function format(ecall) {
                if(ecall.lastDate) {
                    ecall.lastDate = new Date(ecall.lastDate);
                }
                
                return ecall;
            }
        
            function list() {
                return requestDistri.get().then(function (ecalls) {
                    angular.forEach(ecalls, format);
                    
                    return ecalls;
                });
            }
        
            return {
                /**
                 * list all external url calls of your customers
                 */
                list: function () {
                    return list();
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerLocation', ['SeaRequest',
        function seaCustomerLocation(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/location');

            function get(cId) {
                return request.get({
                    cId: cId
                });
            }

            function update(params) {
                return request.post(params);
            }

            return {
                /**
                 * get location
                 * @param {String} cId
                 */
                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update location
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {Object} [geo]
                 * @config {Number} [geo.lat]
                 * @config {Number} [geo.lon]
                 * @config {Object} [geo.address]
                 * @config {String} [geo.address.country]
                 * @config {String} [geo.address.state]
                 * @config {String} [geo.address.postcode]
                 * @config {String} [geo.address.city]
                 * @config {String} [geo.address.road]
                 * @config {String} [geo.address.house_number]
                 */
                update: function (params) {
                    return update(params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerManager', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/manager/{uId}');
            var requestMicroService = new SeaRequest('customer/{cId}/manager/{uId}', 'v3');

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function addUser(cId, email) {
                return requestMicroService.post({
                    cId: cId,
                    uId: email
                });
            }

            function removeUser(cId, uId) {
                return requestMicroService.del({
                    cId: cId,
                    uId: uId
                });
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                /**
                 * add user as manager
                 * @param {Object} params
                 * @config {String} [cId]
                 * @config {String} [email] email address of the user
                 */
                add: function (cId, email) {
                    return addUser(cId, email);
                },

                remove: function (cId, uId) {
                    return removeUser(cId, uId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerProperty', ['SeaRequest',
    function seaCustomerProperty(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/property/{key}');
            var requestPost = new SeaRequest('customer/{cId}/property');
            var requestMicroService = new SeaRequest('customer/{cId}/property', 'v3');
            var requestMicroServiceKey = new SeaRequest('customer/{cId}/property/{key}', 'v3');

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function create(cId, key, value) {
                return requestMicroService.post({
                    cId: cId,
                    key: key,
                    value: value
                });
            }

            function destroy(cId, key) {
                return requestMicroServiceKey.del({
                    cId: cId,
                    key: key
                });
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                /**
                 * add customer property
                 * @param {String} cId
                 * @param {String} key
                 * @param {String} value
                 */
                create: function (cId, key, value) {
                    return create(cId, key, value);
                },

                destroy: function (cId, key) {
                    return destroy(cId, key);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerSetting', ['SeaRequest',
    function seaCustomerSetting(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/setting');
            var requestMicroService = new SeaRequest('customer/{cId}/setting', 'v3');

            function list(cId) {
                return request.get({
                    cId: cId
                });
            }

            function update(cId, settings) {
                settings = settings || {};
                settings.cId = cId;
                return requestMicroService.put(settings);
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                /**
                 * update customer
                 * @param {String} cId
                 * @param {Object} settings
                 */
                update: function (cId, settings) {
                    return update(cId, settings);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerTag', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/tag/{tId}');
            var requestMicroService = new SeaRequest('customer/tag/{tId}', 'v3');

            function create(params) {
                return requestMicroService.post(params);
            }

            function list() {
                return request.get();
            }

            function update(tag) {
                return requestMicroService.put(tag);
            }

            function destroy(tId) {
                return requestMicroService.del({
                    tId: tId
                });
            }

            return {
                /**
                 * create a tag
                 * @param {Object} params
                 * @config {String} [name]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function () {
                    return list();
                },

                /**
                 * update tag
                 * @param {Object} params
                 * @config {String} [tId]
                 * @config {String} [name]
                 */
                update: function (tag) {
                    return update(tag);
                },

                destroy: function (tId) {
                    return destroy(tId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerTemplate', ['SeaRequest',
    function seaCustomerTemplate(SeaRequest) {
            var request = new SeaRequest('customer/template/{tId}'),
                requestAgent = new SeaRequest('customer/template/{tId}/agent/{aId}');

            function list() {
                return request.get();
            }
        
            function listAgents(tId) {
                return requestAgent.get({
                    tId: tId
                });
            }

            function destroy(tId) {
                return request.del({
                    tId: tId
                });
            }
        
            function destroyAgent(tId, aId) {
                return request.del({
                    tId: tId,
                    aId: aId
                });
            }

            return {
                list: function () {
                    return list();
                },

                destroy: function (tId) {
                    return destroy(tId);
                },
                
                agent: {
                    list: function(tId) {
                        return listAgents(tId);
                    },
                    destroy: function(tId, aId) {
                        return destroyAgent(tId, aId);
                    }
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerUsage', ['SeaRequest',
    function seaCustomerTag(SeaRequest) {
            var request = new SeaRequest('customer/{cId}/usage'),
                requestDistri = new SeaRequest('customer/usage');

            function format(u) {
                if (u.date) {
                    u.date = new Date(u.date);
                }

                return u;
            }

            function list(year, month, cId) {
                var params = {
                    year: year,
                    month: month
                };

                if (cId) {
                    params.cId = cId;

                }

                return requestDistri.get(params).then(function (usage) {
                    angular.forEach(usage, format);

                    return usage;
                });
            }

            return {
                /**
                 * list the max usage of all customers or the usage graph of a specific customer
                 * @param   {Date} year of the required usage
                 * @param   {Date} month of the required usage
                 * @param   {String} cId empty or customerId
                 */
                list: function (year, month, cId) {
                    return list(year, month, cId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaCustomerViewFilter', ['SeaRequest',
    function seaCustomerDispatchTime(SeaRequest) {
            var request = new SeaRequest('customer/viewFilter/{vfId}');
            var requestMicroService = new SeaRequest('customer/view-filter/{vfId}', 'v3');

            function create(params) {
                return requestMicroService.post(params);
            }

            function list() {
                return request.get();
            }

            function update(viewFilter) {
                return requestMicroService.put(viewFilter);
            }

            function destroy(vfId) {
                return requestMicroService.del({
                    vfId: vfId
                });
            }

            return {
                /**
                 * create viewFilter
                 * @param {Object} params
                 * @config {String} [name]
                 * @config {Object} [query]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function () {
                    return list();
                },

                /**
                 * update viewFilter
                 * @param {Object} params
                 * @config {String} [vfId]
                 * @config {String} [name]
                 * @config {Object} [query]
                 */
                update: function (viewFilter) {
                    return update(viewFilter);
                },

                destroy: function (vfId) {
                    return destroy(vfId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaGroup', ['SeaRequest', 'seaGroupSetting', 'seaGroupUser',
    function seaGroup(SeaRequest, seaGroupSetting, seaGroupUser) {
            var request = new SeaRequest('group/{gId}');

            function create(params) {
                return request.post(params);
            }

            function get(gId) {
                return request.get({
                    gId: gId
                });
            }

            function update(group) {
                return request.put(group);
            }

            function destroy(gId) {
                return request.del({
                    gId: gId
                });
            }

            return {
                /**
                 * create group
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [name]
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (gId) {
                    return get(gId);
                },

                /**
                 * update group
                 * @param {Object} group
                 * @config {String} [gId]
                 * @config {String} [name]
                 */
                update: function (group) {
                    return update(group);
                },

                destroy: function (gId) {
                    return destroy(gId);
                },

                setting: seaGroupSetting,
                user: seaGroupUser
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaGroupSetting', ['SeaRequest',
    function seaGroupSetting(SeaRequest) {
            var request = new SeaRequest('group/{gId}/setting');

            function list(gId) {
                return request.get({
                    gId: gId
                });
            }

            function update(gId, settings) {
                settings = settings || {};
                settings.gId = gId;
                return request.put(settings);
            }

            return {
                list: function (gId) {
                    return list(gId);
                },

                /**
                 * update group
                 * @param {String} gId
                 * @param {Object} settings
                 */
                update: function (gId, settings) {
                    return update(gId, settings);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaGroupUser', ['SeaRequest',
    function seaGroupUser(SeaRequest) {
            var request = new SeaRequest('group/{gId}/user/{uId}');

            function list(gId) {
                return request.get({
                    gId: gId
                });
            }

            function addUser(gId, uId) {
                return request.put({
                    uId: uId,
                    gId: gId
                });
            }

            function removeUser(gId, uId) {
                return request.del({
                    uId: uId,
                    gId: gId
                });
            }

            return {
                list: function (gId) {
                    return list(gId);
                },

                /**
                 * add user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                add: function (gId, uId) {
                    return addUser(gId, uId);
                },

                /**
                 * remove user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                remove: function (gId, uId) {
                    return removeUser(gId, uId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchContainer', ['SeaRequest', 'seaPatchHelper',
        function seaUser(SeaRequest, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}')),
                requestAction = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}/{action}')),
                requestPatchJobs = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}/patch/{patchId}/jobs')),
                requestPatch = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/container/{cId}/patch/{patchId}'));

            function get(customerId, cId, action, queryParameters) {
                if (action) {
                    var params = {
                        customerId: customerId,
                        cId: cId,
                        action: action,
                    };

                    if (queryParameters) {
                        params = angular.extend({}, params, queryParameters);
                    }

                    return requestAction.get(params);
                }

                return request.get({
                    customerId: customerId,
                    cId: cId,
                });
            }

            function enable(customerId, cId) {
                return requestAction.post({
                    customerId: customerId,
                    cId: cId,
                    action: 'enable',
                });
            }

            function disable(customerId, cId) {
                return requestAction.post({
                    customerId: customerId,
                    cId: cId,
                    action: 'disable',
                });
            }

            function getJobsByPatchId(customerId, cId, queryParameters, patchId) {
                var params = {
                    customerId: customerId,
                    cId: cId,
                    patchId: patchId,
                };
                if (queryParameters) {
                    params = angular.extend({}, params, queryParameters);
                }
                return requestPatchJobs.get(params);
            }

            function getPatchById(customerId, cId, patchId) {
                return requestPatch.get({
                    customerId: customerId,
                    cId: cId,
                    patchId: patchId,
                });
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },
                enable: function (customerId, cId) {
                    return enable(customerId, cId);
                },
                disable: function (customerId, cId) {
                    return disable(customerId, cId);
                },
                category: {
                    list: function (customerId, cId) {
                        return get(customerId, cId, 'categories');
                    }
                },
                job: {
                    list: function (customerId, cId, queryParameters) {
                        return get(customerId, cId, 'jobs', queryParameters);
                    },
                    get: function(customerId, cId, patchId) {
                        return getPatchById(customerId, cId, patchId);
                    },
                    history: function (customerId, cId, queryParameters) {
                        return get(customerId, cId, 'jobs/history', queryParameters);
                    },
                },
                patch: {
                    list: function (customerId, cId, queryParameters) {
                        return get(customerId, cId, 'patches', queryParameters);
                    },
                    get: function (customerId, cId, patchId) {
                        return getPatchById(customerId, cId, patchId);
                    },
                    history: function (customerId, cId, queryParameters) {
                        return get(customerId, cId, 'patches/history', queryParameters);
                    },
                    job: {
                        list: function (customerId, cId, queryParameters, patchId) {
                            return getJobsByPatchId(customerId, cId, queryParameters, patchId);
                        },
                    },
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchHelper', ['seaConfig',
    function (seaConfig) {        
            function getUrl(path) {
                return [seaConfig.getPmUrl(), path].join('/');
            }

            return {
                getUrl: getUrl
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatch', ['SeaRequest', 'seaPatchContainer', 'seaPatchViewFilter', 'seaPatchHelper',
        function seaUser(SeaRequest, seaPatchContainer, seaPatchViewFilter, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/customers')),
            requestCategories = new SeaRequest(seaPatchHelper.getUrl('patch/categories'));

            function listCustomers() {
                return request.get();
            }     

            function listCategories() {
                return requestCategories.get();
            }            
            
            return {
                customer: {
                    list: listCustomers
                },
                category: {
                    list: listCategories,
                },
                container: seaPatchContainer,
                viewFilter: seaPatchViewFilter,
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPatchViewFilter', ['SeaRequest', 'seaPatchHelper',
        function seaUser(SeaRequest, seaPatchHelper) {
            var request = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilters')),
                requestVf = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilter/{vfId}/{action}')),
                requestPost = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilter')),
                requestDel = new SeaRequest(seaPatchHelper.getUrl('patch/{customerId}/viewFilter/{vfId}'));

            function get(customerId, vfId, action, queryParameters) {
                if (vfId) {
                    var params = {
                        customerId: customerId,
                        vfId: vfId,
                        action: action,
                    };

                    if (queryParameters) {
                        params = angular.extend({}, params, queryParameters);
                    }

                    return requestVf.get(params);
                }

                return request.get({
                    customerId: customerId,
                });
            }

            function post(customerId, vfId, body, action) {
                if (vfId) {
                    var params = angular.extend({}, { customerId: customerId, vfId: vfId, action: action }, body);
                    return requestVf.post(params);
                }

                var params = angular.extend({}, { customerId: customerId }, body);
                return requestPost.post(params);
            }

            function del(customerId, vfId) {
                return requestDel.del({ customerId: customerId, vfId: vfId });
            }

            return {
                list: function (customerId) {
                    return get(customerId);
                },
                create: function (customerId, body) {
                    return post(customerId, false, body);
                },
                destroy: function (customerId, vfId) {
                    return del(customerId, vfId);
                },
                container: {
                    list: function (customerId, vfId) {
                        return get(customerId, vfId, 'containers');
                    }
                },
                job: {
                    list: function (customerId, vfId, queryParameters) {
                        return get(customerId, vfId, 'jobs', queryParameters);
                    },
                    history: function (customerId, vfId, queryParameters) {
                        return get(customerId, vfId, 'jobs/history', queryParameters);
                    },
                },
                patch: {
                    list: function (customerId, vfId, queryParameters) {
                        return get(customerId, vfId, 'patches', queryParameters);
                    },
                    history: function (customerId, vfId, queryParameters) {
                        return get(customerId, vfId, 'patches/history', queryParameters);
                    },
                },
                setting: {
                    list: function (customerId, vfId) {
                        return get(customerId, vfId, 'settings');
                    },

                    update: function (customerId, vfId, body) {
                        return post(customerId, vfId, body, 'settings');
                    }
                },

            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellHelper', ['seaConfig',
        function (seaConfig) {
            function getUrl(path) {
                return [seaConfig.getMicroServiceUrl(), seaConfig.getMicroServiceApiVersion(), 'powershell', path].join('/');
            }

            return {
                getUrl: getUrl
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepository', ['SeaRequest', 'seaPowerShellHelper', 'seaPowerShellRepositoryScript', 'seaPowerShellRepositoryUser', 'seaPowerShellRepositoryUtil',
        function (SeaRequest, seaPowerShellHelper, seaPowerShellRepositoryScript, seaPowerShellRepositoryUser, seaPowerShellRepositoryUtil) {
            var request = new SeaRequest(seaPowerShellHelper.getUrl('repository'));
            var requestRepository = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}'));

            function listRepositories() {
                return request.get();
            }

            function get(repositoryId) {
                return requestRepository.get({
                    repositoryId: repositoryId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return requestRepository.put(params);
            }

            function destroy(repositoryId) {
                return requestRepository.del({
                    repositoryId: repositoryId,
                });
            }

            return {
                list: function () {
                    return listRepositories();
                },
                get: function (repositoryId) {
                    return get(repositoryId);
                },
                /**
                 * create repository
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [distributorId]
                 * @config {String} name
                 * @config {String} [description]
                 */
                create: function (params) {
                    return create(params);
                },
                /**
                 * update repository
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} [customerId]
                 * @config {String} [distributorId]
                 * @config {String} name
                 * @config {String} [description]
                 */
                update: function (params) {
                    return update(params);
                },
                destroy: function (repositoryId) {
                    return destroy(repositoryId);
                },

                script: seaPowerShellRepositoryScript,
                user: seaPowerShellRepositoryUser,
                util: seaPowerShellRepositoryUtil,
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepositoryScript', ['SeaRequest', 'seaPowerShellHelper',
        function (SeaRequest, seaPowerShellHelper) {
            var request = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/script'));
            var requestScripts = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/scripts'));
            var requestScript = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/script/{scriptId}'));

            function listScripts() {
                return requestScripts.get();
            }

            function get(repositoryId, scriptId) {
                return requestScript.get({
                    repositoryId: repositoryId,
                    scriptId: scriptId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return requestScript.put(params);
            }

            function destroy(repositoryId, scriptId) {
                return requestScript.del({
                    repositoryId: repositoryId,
                    scriptId: scriptId,
                });
            }

            return {
                list: function () {
                    return listScripts();
                },
                get: function (repositoryId, scriptId) {
                    return get(repositoryId, scriptId);
                },
                /**
                 * create script
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} name
                 * @config {String} [description]
                 * @config {String} script
                 */
                create: function (params) {
                    return create(params);
                },
                /**
                 * update script
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} scriptId
                 * @config {String} name
                 * @config {String} [description]
                 * @config {String} script
                 */
                update: function (params) {
                    return update(params);
                },
                destroy: function (repositoryId, scriptId) {
                    return destroy(repositoryId, scriptId);
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepositoryUser', ['SeaRequest', 'seaPowerShellHelper',
        function (SeaRequest, seaPowerShellHelper) {
            var request = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/user/{userId}'));

            function add(params) {
                return request.post(params);
            }

            function update(params) {
                return request.put(params);
            }

            function remove(repositoryId, userId) {
                return request.del({
                    repositoryId: repositoryId,
                    userId: userId,
                });
            }

            return {
                /**
                 * add user
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} userId
                 * @config {'ADMIN' | 'EDITOR' | 'READER'} role
                 */
                add: function (params) {
                    return add(params);
                },
                /**
                 * update user
                 * @param {Object} params
                 * @config {String} repositoryId
                 * @config {String} userId
                 * @config {'ADMIN' | 'EDITOR' | 'READER'} role
                 */
                update: function (params) {
                    return update(params);
                },
                remove: function (repositoryId, userId) {
                    return remove(repositoryId, userId);
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaPowerShellRepositoryUtil', ['SeaRequest', 'seaPowerShellHelper',
        function (SeaRequest, seaPowerShellHelper) {
            var parseRequest = new SeaRequest(seaPowerShellHelper.getUrl('script/parse'));
            var agentsRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/{repositoryId}/script/{scriptId}/agent'));
            var settingRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/agent/setting'));
            var agentScriptRequest = new SeaRequest(seaPowerShellHelper.getUrl('repository/script/agent/{agentId}'));

            function parseScript(script) {
                return parseRequest.post(script);
            }

            function listAgents(repositoryId, scriptId) {
                return agentsRequest.get({
                    repositoryId: repositoryId,
                    scriptId: scriptId,
                });
            }
            
            function getScriptByAgent(agentId) {
                return agentScriptRequest.get({
                    agentId: agentId,
                });
            }

            function updateSettings(params) {
                return settingRequest.put({
                    powerShellRepositoryId: params.repositoryId,
                    powerShellRepositoryScriptId: params.scriptId,
                    agentId: params.agentId,
                });
            }

            return {
                parseScript: function (script) {
                    return parseScript(script);
                },
                listAgents: function (repositoryId, scriptId) {
                    return listAgents(repositoryId, scriptId);
                },
                getScriptByAgent: function (agentId) {
                    return getScriptByAgent(agentId);
                },
                /**
                * update agent settings
                * @param {Object} params
                * @config {String} repositoryId
                * @config {String} scriptId
                * @config {String} agentId
                */
                updateSettings: function (params) {
                    return updateSettings(params);
                }

            }
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaReporting', ['SeaRequest', 'seaReportingTemplate',
    function seaCustomer(SeaRequest, seaReportingTemplate) {
            var request = new SeaRequest('reporting/{cId}/report'),
                reportRequest = new SeaRequest('reporting/{cId}/report/{rId}');
            var requestMicroService = new SeaRequest('reporting/{cId}/report', 'v3'),
                reportRequestMicroService = new SeaRequest('reporting/{cId}/report/{rId}', 'v3');

            function formatReport(report) {
                ['startDate', 'lastDate', 'nextDate'].forEach(function (prop) {
                    if(report[prop]) {
                        report[prop] = new Date(report[prop]);
                    }
                });
                
                if(report.history) {
                    report.history.forEach(function (generated) {
                        generated.generatedDate = new Date(generated.generatedDate);
                    });
                }
                
                return report;
            }
        
            function create(params) {
                return requestMicroService.post(params);
            }
        
            function list(cId) {
                return request.get({
                    cId: cId
                }).then(function (reports) {
                    reports.forEach(formatReport);
                    return reports;
                });
            }
        
            function listTypes(cId) {
                return reportRequest.get({
                    cId: cId,
                    rId: 'type'
                });
            }

            function get(cId, rId) {
                return reportRequest.get({
                    cId: cId,
                    rId: rId
                }).then(function (report) {
                    return formatReport(report);
                });
            }
        
            function destroy(cId, rId) {
                return requestMicroService.del({
                    cId: cId,
                    rId: rId
                });
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                type: {
                    list: function (cId) {
                        return listTypes(cId);
                    }
                },
                
                report: {
                    get: function (cId, rId) {
                        return get(cId, rId);
                    },
                    
                    /**
                     * create report
                     * @param {Object} params
                     * @config {String} [cId]
                     * @config {String} [rtId]
                     * @config {String} [repeatCron]
                     * @config {String} [recipients]
                     */
                    create: function(params) {
                        return create(params);
                    },
                    
                    destroy: function (cId, rId) {
                        return destroy(cId, rId);
                    }
                },

                template: seaReportingTemplate
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaReportingTemplate', ['SeaRequest',
        function seaReportingTemplate(SeaRequest) {
            var request = new SeaRequest('reporting/template/{rtId}');
            var requestMicroService = new SeaRequest('reporting/template/{rtId}', 'v3');

            function create(params) {
                return requestMicroService.post(params);
            }

            function list() {
                return request.get();
            }

            function get(rId) {
                return request.get({
                    rtId: rtId
                });
            }

            function destroy(rId) {
                return requestMicroService.del({
                    rtId: rtId
                });
            }

            return {
                list: function (cId) {
                    return list(cId);
                },

                get: function (rtId) {
                    return get(rtId);
                },

                /**
                 * create report template
                 * @param {Object} params
                 * @config {String} [name]
                 * @config {Array} [widgets]
                 */
                create: function (params) {
                    return create(params);
                },

                destroy: function (rtId) {
                    return destroy(rtId);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingAntivirus', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/virus/1.0/{section}/{action}'));

            function format(container) {
                if (!container.EventList) {
                    return container;
                }

                container.EventList.forEach(function (job) {
                    ['Timestamp'].forEach(function (key) {
                        if (job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });

                return container;
            }

            function activate(params) {
                var customerId = params.customerId,
                    containerConfig = params.containerConfig;

                if (!angular.isArray(containerConfig)) {
                    containerConfig = [containerConfig];
                }

                containerConfig = containerConfig.map(function (c) {
                    return {
                        ContainerId: c.containerId,
                        Token: c.token
                    };
                });

                return request.post({
                    section: 'container',
                    ContainerList: containerConfig
                });
            }

            function get(customerId, cId) {
                return list(customerId, [cId]);
            }

            function list(customerId, containerIds) {
                var query = helper.getContainerIds(containerIds);
                query.section = 'container';
                query.action = 'get';
                
                return request.post(query);
            }
        
            function getEvents(customerId, cId, paging) {
                return listEvents(customerId, [cId], paging).then(function (history) {
                    return (history[0] || {}).EventList;
                });
            }

            function listEvents(customerId, containerIds, paging) {
                var query = helper.getContainerIds(containerIds);
                query.section = 'event';
                query.action = 'get';

                if (paging) {
                    query.Index = paging.index;
                    query.Count = paging.count;
                }

                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }
        
            function checkEvents(customerId, containerIds, eventIds) {
                var query = helper.getEventIds(eventIds);
                query.section = 'event';
                query.action = 'check';
                
                return request.post(query);
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },

                list: function (customerId, containerIds) {
                    return list(customerId, containerIds);
                },

                /**
                 * activate antivirus on a client
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {Array|Object} [containerConfig]
                 * @config {String} [config.id]
                 * @config {String} [config.token]
                 */
                activate: function (params) {
                    return activate(params);
                },

                event: {
                    get: function (customerId, cId, paging) {
                        return getEvents(customerId, cId, paging);
                    },

                    list: function (customerId, containerIds, paging) {
                        return getEvents(customerId, containerIds, paging);
                    },
                    
                    check: function (customerId, containerIds, eventIds) {
                        return checkEvents(customerId, containerIds, eventIds);
                    }
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingIasHelper', [ '$q', 'seaConfig',
    function seaRemotingPcvisit($q, seaConfig) {
            function getContainerIds(containerIds) {
                return convertIds(containerIds, 'ContainerIdList', 'ContainerId');
            }

            function getSoftwareIds(softwareIds) {
                return convertIds(softwareIds, 'SoftwareIdList', 'SoftwareId');
            }

            function getJobIds(jobIds) {                
                return convertIds(jobIds, 'JobIdList', 'JobId');
            }
        
            function getEventIds(eventIds) {
                return convertIds(eventIds, 'EventIdList', 'EventId');
            }
        
            function convertIds(ids, rootName, subName) {
                if (!angular.isArray(ids)) {
                    ids = [ids];
                }

                var query = ids.map(function (id) {
                    var o = {};
                    o[subName] = id;
                    return o;
                });

                var o = {};
                o[rootName] = query;
                
                return o;
            }

            function idListResult(result) {
                if (result.Msg == 'success') {
                    return $q.resolve(result.IdList.map(function (entry) {
                        return entry.Id;
                    }));
                }

                return $q.reject(new Error(result.Msg));
            }
        
            function getUrl(path) {
                return [seaConfig.getPatchUrl(), path].join('/');
            }

            return {
                getContainerIds: getContainerIds,
                getSoftwareIds: getSoftwareIds,
                getJobIds: getJobIds,
                getEventIds: getEventIds,
                idListResult: idListResult,
                getUrl: getUrl
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingNetwork', ['SeaRequest',
    function seaRemotingNetwork(SeaRequest) {
            var request = new SeaRequest('network/{customerId}/{cId}/system/{action}');
            var requestMicroService = new SeaRequest('network/{customerId}/{cId}/system/{action}', 'v3');

            function format(job) {
                if (job && job.createdAt) {
                    job.createdAt = new Date(job.createdAt);
                }

                return job;
            }

            function list(params) {
                return request.get(params);
            }

            function install(params) {
                return requestMicroService.post(params);
            }
        
            function getInstallStatus(params) {
                params = params || {};
                
                var customerId = params.customerId,
                    cId = params.cId,
                    version = params.version,
                    jobIds = params.jobIds;
                
                return request.get({
                    customerId: customerId,
                    cId: cId,
                    action: 'installstatus',
                    v: version,
                    jobIds: jobIds
                }).then(function (jobs) {
                   jobs.forEach(format);
                    return jobs;
                });
            }

            return {
                system: {
                    /**
                     * list active directory of OCC Connector
                     * @param {Object} params
                     * @config {String} [customerId]
                     * @config {String} [cId] ID of the OCC Connector
                     * @config {String} [user]
                     * @config {String} [domain]
                     * @config {String} [password]
                     */
                    list: function (params) {
                        return list(params);
                    },

                    /**
                     * install Server-Eye on remote system
                     * @param {Object} params
                     * @config {String} [customerId]
                     * @config {String} [cId] ID of the OCC Connector
                     * @config {String} [user]
                     * @config {String} [domain]
                     * @config {String} [password]
                     * @config {String} [host] Name of the host Server-Eye will be installed on
                     */
                    install: function (params) {
                        return install(params);
                    },

                    /**
                     * get the install status of install jobs
                     * @param {Object} params
                     * @config {String} [customerId]
                     * @config {String} [cId] ID of the OCC Connector
                     * @config {Array}  [jobIds]
                     * @config {Integer} [version] remote install version
                     */
                    installStatus: function (params) {
                        return getInstallStatus(params);
                    }
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatch', ['$http', 'SeaRequest', 'seaRemotingIasHelper', 'seaRemotingPatchHistory', 'seaRemotingPatchInstall', 'seaRemotingPatchReboot', 'seaRemotingPatchScan', 'seaRemotingPatchSoftware',
    function seaRemotingPcvisit($http, SeaRequest, helper, seaRemotingPatchHistory, seaRemotingPatchInstall, seaRemotingPatchReboot, seaRemotingPatchScan, seaRemotingPatchSoftware) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/{section}/{action}'));
            var dateKeys = ["LastScanTime", "LastInstallJobTime", "NextInstallJobTime"];
        
            function format(container) {
                dateKeys.forEach(function (key) {
                    if(container[key]) {
                        container[key] = new Date(container[key]);
                    }
                });
                
                return container;
            }
                
            function get(customerId, cId) {
                return list(customerId, [cId]);
            }

            function list(customerId, containerIds) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';
                
                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }
                
            function activate(params) {
                var customerId = params.customerId,
                    containerConfig = params.containerConfig,
                    cron = params.cron;
                
                if(!angular.isArray(containerConfig)) {
                    containerConfig = [ containerConfig ];
                }
                
                containerConfig = containerConfig.map(function (c) {
                    return {
                        ContainerId: c.containerId,
                        Token: c.token
                    };
                });
                
                return request.post({
                    ContainerList: containerConfig,
                    Cron: cron
                });
            }
        
            function destroy(customerId, containerIds) {
                var query = helper.getContainerIds(containerIds);
                
                return request.del(query)
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },

                list: function (customerId, containerIds) {
                    return list(customerId, containerIds);
                },
                
                /**
                 * activate patchmanagement on a client
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {Array|Object} [containerConfig]
                 * @config {String} [config.id]
                 * @config {String} [config.token]
                 * @config {String} [cron]
                 */
                activate: function (params) {
                    return activate(params);
                },
                deactivate: function (customerId, containerIds) {
                    return destroy(customerId, containerIds);
                },
                
                history: seaRemotingPatchHistory,
                install: seaRemotingPatchInstall,
                reboot: seaRemotingPatchReboot,
                scan: seaRemotingPatchScan,
                software: seaRemotingPatchSoftware
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPcvisit', ['SeaRequest',
    function seaRemotingPcvisit(SeaRequest) {
            var request = new SeaRequest('pcvisit/{customerId}/{cId}/{action}');

            function format(access) {
                if(access && access.date) {
                    access.data = new Date(access.date);
                }
                
                return access;
            }
        
            function get(customerId, cId) {
                return request.get({
                    customerId: customerId,
                    cId: cId
                }).then(function (system) {
                    format(system.lastAccess);
                    return system;
                });
            }
        
            function start(params) {
                params = params || {};
                params.action = 'start';
                
                return request.post(params);
            }

            function isInstalled(customerId, cId) {
                return request.get({
                    customerId: customerId,
                    cId: cId,
                    action: 'check'
                });
            }

            return {
                get: function(customerId, cId) {
                    return get(customerId, cId);
                },
                
                /**
                 * install pcvisit on remote system
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [cId]
                 * @config {String} [supporterId]
                 * @config {String} [supporterPassword]
                 * @config {String} [user]
                 * @config {String} [domain]
                 * @config {String} [password]
                 */
                installAndStart: function (params) {
                    return start(params);
                },
                
                isInstalled: function (customerId, cId) {
                    return isInstalled(customerId, cId);
                },
                
                getConnectFileLink: function (customerId, cId) {
                    return request.formatUrl({
                        customerId: customerId,
                        cId: cId,
                        action: 'file'
                    });
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPowershell', ['SeaRequest',
    function seaRemotingPowershell(SeaRequest) {
            var request = new SeaRequest('powershell/{customerId}/{cId}/{action}', 'v3');
        
            function start(params) {
                params = params || {};
                params.action = 'start';
                
                return request.post(params);
            }

            return {
                /**
                 * start a powershell session on a remote machine
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [cId]
                 */
                start: function (params) {
                    return start(params);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemoting', ['SeaRequest', 'seaRemotingPcvisit', 'seaRemotingNetwork', 'seaRemotingAntivirus', 'seaRemotingPatch', 'seaRemotingPowershell',
        function seaRemoting(SeaRequest, seaRemotingPcvisit, seaRemotingNetwork, seaRemotingAntivirus, seaRemotingPatch, seaRemotingPowershell) {
            var shutdownRequest = new SeaRequest('shutdown/{customerId}/{containerId}');

            function shutdown(customerId, containerId, credentials, force, reboot) {
                return shutdownRequest.post({
                    customerId: customerId,
                    containerId: containerId,
                    force: force,
                    reboot: reboot,
                    user: credentials.user,
                    password: credentials.password,
                    domain: credentials.domain,
                });
            }

            return {
                antivirus: seaRemotingAntivirus,
                pcvisit: seaRemotingPcvisit,
                powershell: seaRemotingPowershell,
                network: seaRemotingNetwork,
                patch: seaRemotingPatch,
                shutdown: function (customerId, containerId, credentials, force, reboot) {
                    return shutdown(customerId, containerId, credentials, force, reboot);
                }
            };
        }]);
})();

(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgent', ['SeaRequest',
                                             'seaAgentNote', 'seaAgentNotification', 'seaAgentMisc',
                                             'seaAgentSetting', 'seaAgentState', 'seaAgentTag', 'seaAgentType',
    function seaAgent(SeaRequest, seaAgentNote, seaAgentNotification, seaAgentMisc, seaAgentSetting, seaAgentState, seaAgentTag, seaAgentType) {
            var request = new SeaRequest('agent/{aId}');
                
            function create(params) {
                return request.post(params);
            }

            function get(aId) {
                return request.get({
                    aId: aId
                });
            }

            function update(agent) {
                return request.put(agent);
            }

            function destroy(aId) {
                return request.del({
                    aId: aId
                });
            }

            return {
                /**
                 * create agent
                 * @param {Object} params
                 * @config {String} [parentId]
                 * @config {String} [type]
                 */
                create: function (params) {
                    return create(params);
                },
                copy: seaAgentMisc.copy,

                get: function (aId) {
                    return get(aId);
                },

                /**
                 * update agent
                 * @param {Object} agent
                 * @config {String} [aId]
                 * @config {String} [name]
                 * @config {Number} [interval]
                 */
                update: function (agent) {
                    return update(agent);
                },

                destroy: function (aId) {
                    return destroy(aId);
                },

                note: seaAgentNote,
                actionlog: seaAgentMisc.actionlog,
                chart: seaAgentMisc.chart,
                notification: seaAgentNotification,
                setting: seaAgentSetting,
                state: seaAgentState,
                category: seaAgentMisc.category,
                restart: seaAgentMisc.restart,
                tag: seaAgentTag,
                type: seaAgentType,
                events: seaAgentMisc.events,
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentMisc', ['SeaRequest',
        function seaAgentMisc(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/{action}');
            var requestMicroService = new SeaRequest('agent/{aId}/{action}', 'v3');

            function formatActionlog(entry) {
                entry.changeDate = new Date(entry.changeDate);
                entry.changed = JSON.parse(entry.changed);
                try {
                    entry.userName = JSON.parse(entry.userName);
                } catch (e) {
                    entry.userName = {
                        email: entry.userName,
                        sur: entry.userName
                    };
                }

                if (entry.information) {
                    try {
                        entry.information = JSON.parse(entry.information);
                    } catch (e) {
                        entry.information = null;
                    }
                }

                return entry;
            }

            function formatMeasurement(m) {
                m.ts = new Date(m.name);
                return m;
            }

            function listActionlog(aId, params) {
                params = params || {};
                params.aId = aId;
                params.action = 'actionlog';
                return request.get(params);
            }

            function listEvents(aId, params) {
                params = params || {};
                params.aId = aId;
                params.action = 'events';
                return request.get(params);
            }

            function getChart(aId, params) {
                params = params || {};
                params.aId = aId;
                params.action = 'chart';
                return request.get(params);
            }

            function copy(aId, parentId) {
                var params = {};
                params.aId = aId;
                params.parentId = parentId;
                params.action = 'copy';
                return request.post(params);
            }

            function restart(aId) {
                var params = {};
                params.aId = aId;
                params.action = 'restart';
                return requestMicroService.post(params);
            }

            function listCategories() {
                return request.get({}, 'agent/category');
            }

            return {
                actionlog: {
                    /**
                     * list action log entries
                     * @param   {String} aId    agent id
                     * @param   {Object} params
                     * @config  {Number} start
                     * @config  {Number} limit
                     * @returns {Object} promise
                     */
                    list: function (aId, params) {
                        return listActionlog(aId, params).then(function (entries) {
                            angular.forEach(entries, formatActionlog);

                            return entries;
                        });
                    }
                },

                events: {
                    /**
                     * list action log entries
                     * @param   {String} aId    agent id
                     * @param   {Object} params
                     * @config  {Number} start
                     * @config  {Number} end
                     * @returns {Object} promise
                     */
                    list: function (aId, params) {
                        return listEvents(aId, params);
                    }
                },

                chart: {
                    /**
                     * get chart config and values
                     * @param   {String} aId    agent id
                     * @param   {Object} params
                     * @config  {Number} start
                     * @config  {Number} limit
                     * @config  {Number} valueType
                     * @returns {Object} promise
                     */
                    get: function (aId, params) {
                        return getChart(aId, params).then(function (chartConfig) {
                            angular.forEach(chartConfig.measurements, formatMeasurement);

                            return chartConfig;
                        });
                    }
                },
                category: {
                    list: listCategories
                },
                /**
                 * copy agent to a parent
                 * @param   {String} aId
                 * @param   {String}   parentId
                 * @returns {Object} promise
                 */
                copy: function (aId, parentId) {
                    return copy(aId, parentId);
                },



                /**
                 * restart an agent
                 * @param   {String} aId
                 * @returns {Object} promise
                 */
                restart: function (aId) {
                    return restart(aId);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentNote', ['SeaRequest',
    function seaAgentNote(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/note/{nId}');
            var requestMicroService = new SeaRequest('agent/{aId}/note/{nId}', 'v3');

            function formatNote(note) {
                note.postedOn = new Date(note.postedOn);
                return note;
            }

            function create(params) {
                return requestMicroService.post(params).then(formatNote);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                }).then(function (notes) {
                    angular.forEach(notes, formatNote);

                    return notes;
                });
            }
        
            function count(aId) {
                return request.get({
                    aId: aId,
                    nId: 'count'
                });
            }

            function destroy(aId, nId) {
                return requestMicroService.del({
                    aId: aId,
                    nId: nId
                });
            }

            return {
                /**
                 * create agent note
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [message]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function (aId) {
                    return list(aId);
                },
                
                count: function (aId) {
                    return count(aId);
                },

                destroy: function (aId, nId) {
                    return destroy(aId, nId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentNotification', ['SeaRequest',
    function seaAgentNitification(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/notification/{nId}');
            var requestMicroService = new SeaRequest('agent/{aId}/notification/{nId}', 'v3');

            function create(params) {
                return request.post(params);
            }

            function update(notification) {
                return requestMicroService.put(notification);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                });
            }

            function destroy(aId, nId) {
                return request.del({
                    aId: aId,
                    nId: nId
                });
            }

            return {
                /**
                 * create notification
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [userId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                create: function (params) {
                    return create(params);
                },

                /**
                 * update notification
                 * @param {Object} params
                 * @config {String} [nId]
                 * @config {String} [aId]
                 * @config {String} [userId]
                 * @config {Boolean} [mail]
                 * @config {Boolean} [phone]
                 * @config {Boolean} [ticket]
                 * @config {String} [deferId]
                 */
                update: function (notification) {
                    return update(notification);
                },

                list: function (aId) {
                    return list(aId);
                },

                destroy: function (aId, nId) {
                    return destroy(aId, nId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentSetting', ['SeaRequest',
        function seaAgentSetting(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/setting/{key}'),
                remoteRequest = new SeaRequest('agent/{aId}/setting/{key}/remote');
            var requestMicroService = new SeaRequest('agent/{aId}/setting/{key}', 'v3');
            var remoteRequestMicroService = new SeaRequest('agent/{aId}/setting/{key}/remote', 'v3');

            function update(setting) {
                return request.put(setting);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                });
            }

            function remote(param) {
                return remoteRequest.get(param);
            }

            return {
                /**
                 * create agent note
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [key]
                 * @config {String} [value]
                 */
                update: function (setting) {
                    return update(setting);
                },

                list: function (aId) {
                    return list(aId);
                },

                /**
                 * load settings from remote
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [key]
                 * @config {String} [information]
                 */
                remote: function (param) {
                    return remote(param);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentState', ['SeaRequest', 'SeaTransform', 'SeaTransformTemplate',
        function seaAgentState(SeaRequest, SeaTransform, SeaTransformTemplate) {
            var request = new SeaRequest('agent/{aId}/state/{method}'),
                stateRequest = new SeaRequest('agent/{aId}/state/{sId}'),
                hintRequest = new SeaRequest('agent/{aId}/state/{sId}/hint');
            var requestMicroService = new SeaRequest('agent/{aId}/state/{method}', 'v3'),
                stateRequestMicroService = new SeaRequest('agent/{aId}/state/{sId}', 'v3'),
                hintRequestMicroService = new SeaRequest('agent/{aId}/state/{sId}/hint', 'v3');

            function formatState(state) {
                state.date = new Date(state.date);
                state.lastDate = new Date(state.lastDate);

                if (state.silencedUntil) {
                    state.silencedUntil = new Date(state.silencedUntil);
                }

                if (state.hints) {
                    angular.forEach(state.hints, formatHint);
                }

                return state;
            }

            function formatHint(hint) {
                hint.date = new Date(hint.date);

                if (hint.until) {
                    hint.until = new Date(hint.until);
                }

                return hint;
            }

            function hint(params) {
                var parser = new SeaTransform(SeaTransformTemplate.AGENT.STATE.HINT.CREATE);
                var paramsParsed = parser.parse(params);

                return hintRequestMicroService.post(paramsParsed).then(formatHint);
            }

            function stats(aId, params) {
                params = params || {};
                params.aId = aId;
                params.method = 'stats';

                return request.get(params);
            }

            function list(aId, params) {
                params = params || {};
                params.aId = aId;

                if (angular.isArray(params.aId)) {
                    return request.post(params, 'agent/state').then(function (statesById) {
                        if (angular.isArray(statesById)) {
                            var n = {};
                            n[params.aId[0]] = statesById;
                            statesById = n;
                        }

                        angular.forEach(Object.keys(statesById), function (key) {
                            angular.forEach(statesById[key], formatState);
                        });

                        return statesById;
                    });
                }
                return request.get(params).then(function (states) {
                    angular.forEach(states, formatState);

                    return states;
                });
            }

            function get(aId, sId, params) {
                params = params || {};
                params.sId = sId;
                params.aId = aId;

                return stateRequest.get(params).then(function (state) {
                    return formatState(state);
                });
            }

            return {
                /**
                 * create agent state hint
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [sId]
                 * @config {String} [author]
                 * @config {Number} [hintType]
                 * @config {String} [message]
                 * @config {String} [assignedUser]
                 * @config {Array} [mentionedUsers]
                 * @config {Boolean} [private]
                 * @config {Number} [until]
                 */
                hint: function (params) {
                    return hint(params);
                },

                /**
                 * list agent states
                 * @param   {String}   aId
                 * @param {Object}
                 * @config {Number} [limit]
                 * @config {Number} [start]
                 * @config {Number} [end]
                 * @config {Boolean} [includeHints]
                 * @config {Boolean} [includeRawData]
                 * @config {String} [format]
                 */
                list: function (aId, params) {
                    return list(aId, params);
                },

                /**
               * get state by Id
               * @param   {String}   aId
               * @param   {String}   sId
               * @param {Object}
               * @config {Boolean} [includeHints]
               * @config {Boolean} [includeMessage]
               * @config {Boolean} [includeRawData]
               * @config {String} [format]
               */
                get: function (aId, sId, params) {
                    return get(aId, sId, params);
                },

                /**
                 * list agent state stats
                 * @param   {String}   aId
                 * @param {Object}
                 * @config {Number} [start] : now
                 * @config {Number} [end]   : now - 12 months
                 */
                stats: function (aId, params) {
                    return stats(aId, params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentTag', ['SeaRequest',
    function seaAgentNote(SeaRequest) {
            var request = new SeaRequest('agent/{aId}/tag/{tId}');

            function create(params) {
                return request.put(params);
            }

            function list(aId) {
                return request.get({
                    aId: aId
                });
            }

            function destroy(aId, tId) {
                return request.del({
                    aId: aId,
                    tId: tId
                });
            }

            return {
                /**
                 * add tag to agent
                 * @param {Object} params
                 * @config {String} [aId]
                 * @config {String} [tId]
                 */
                create: function (params) {
                    return create(params);
                },

                list: function (aId) {
                    return list(aId);
                },

                destroy: function (aId, tId) {
                    return destroy(aId, tId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaAgentType', ['SeaRequest',
    function seaAgentType(SeaRequest) {
            var request = new SeaRequest('agent/type');
            var requestFaq = new SeaRequest('agent/type/{agentType}/faq');

            function format(agentKnown) {
                if(agentKnown.updateDate) {
                    agentKnown.updateDate = new Date(agentKnown.updateDate);
                }
                
                return agentKnown;
            }
        
            function listSettings(akId) {
                return request.get({
                    akId: akId
                }, 'agent/type/{akId}/setting');
            }

            function list(params) {
                return request.get(params).then(function (aks) { return aks.map(format); });
            }

            function listFaq(agentType) {
                return requestFaq.get({agentType: agentType});
            }

            return {
                setting: {
                    /**
                     * list settings of an agent type
                     * @param {Object} params
                     * @config {String} [akId]
                     */
                    list: function (akId) {
                        return listSettings(akId);
                    }
                },

                list: list,
                faq: {
                    list: function(agentType) {
                        return listFaq(agentType);
                    },
                },
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaSearch', ['SeaRequest',
        function seaSearch(SeaRequest) {
            var request = new SeaRequest('search/{sub}');

            function actionlog(params) {
                params = params || {};
                params.sub = 'actionlog';

                return request.post(params);
            }

            return {
                /**
                 * search through actionlog
                 * @param {Object} params
                 * @config {Object} [query]
                 * @config {Number} [limit]
                 * @config {Number} [start]
                 */
                actionlog: function (params) {
                    return actionlog(params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultEntry', ['SeaRequest', 'seaVaultHelper',
        function (SeaRequest, seaVaultHelper) {
            var request = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entry'));
            var requestEntry = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entry/{eId}'));
            var requestAction = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entry/{eId}/{action}'));
            var requestEntries = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entries'));
            var requestAgentSetting = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/entry/{eId}/agent/{aId}/setting/{key}'));

            function listEntries(vId) {
                return requestEntries.get({
                    vId: vId,
                });
            }

            function create(params) {
                return request.post(params);
            }

            function get(vId, eId) {
                return requestEntry.get(vId, eId);
            }

            function update(params) {
                return requestEntry.put(params);
            }

            function destroy(vId, eId) {
                return requestEntry.del({ vId, eId });
            }

            function unlock(params) {
                params = angular.extend({}, params, { action: 'unlock' });
                return requestAction.put(params);
            }

            function updateAgentSetting(params) {
                return requestAgentSetting.put(params);
            }


            return {
                list: function (vId) {
                    return listEntries(vId);
                },

                /**
                 * create entry
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} name
                 * @config {String} description
                 * @config {String} [password]
                 * @config {String} [privateKey]
                 * @config {Object} credentials 
                 */
                create: function (params) {
                    return create(params);
                },
                get: function (vId, eId) {
                    return get(vId, eId);
                },

                /**
                 * update entry
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} eId
                 * @config {String} name
                 * @config {String} description
                 * @config {String} [password]
                 * @config {String} [privateKey]
                 * @config {Object} credentials 
                 */
                update: function (params) {
                    return update(params);
                },
                destroy: function (vId, eId) {
                    return destroy(vId, eId);
                },
                /**
                * unlock vault
                * @param {Object} params
                * @config {String} vId
                * @config {String} [password]
                * @config {String} [privateKey]
                */
                unlock: function (params) {
                    return unlock(params);
                },
                agent: {
                    setting: {
                        /**
                        * update agent settings with vault entries
                        * @param {Object} params
                        * @config {String} vId   vaultId
                        * @config {String} eId   entryId
                        * @config {String} aId   agentId
                        * @config {String} key   agent setting key
                        * @config {String} [password]
                        * @config {String} [privateKey]
                        */

                        update: function (params) {
                            return updateAgentSetting(params);
                        }
                    }
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultHelper', ['seaConfig',
    function (seaConfig) {        
            function getUrl(path) {
                return [seaConfig.getMicroServiceUrl(), seaConfig.getMicroServiceApiVersion(), path].join('/');
            }

            return {
                getUrl: getUrl
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultUser', ['SeaRequest', 'seaVaultHelper',
        function (SeaRequest, seaVaultHelper) {
            var request = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/user/{uId}'));

            function create(params) {
                return request.post(params);
            }

            function update(params) {
                return request.put(params);
            }

            function destroy(vId, uId) {
                return request.del({
                    vId: vId,
                    uId: uId,
                });
            }

            return {
                /**
                 * grant user access to a vault
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} uId
                 * @config {String} password
                 * @config {'ADMIN' | 'EDITOR' | 'READER'} role
                 */
                create: function (params) {
                    return create(params);
                },

                /**
                 * update user
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} uId
                 * @config {String} password
                 * @config {'ADMIN' | 'EDITOR' | 'READER'} role
                 */
                update: function (params) {
                    return update(params);
                },

                destroy: function (vId, uId) {
                    return destroy(vId, uId);
                },
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVaultUtil', ['SeaRequest', 'seaVaultHelper',
        function (SeaRequest, seaVaultHelper) {

            var agentsRequest = new SeaRequest(seaVaultHelper.getUrl('vault/{vaultId}/entry/{entryId}/key/{credentialKey}/agent/'));
            var settingRequest = new SeaRequest(seaVaultHelper.getUrl('vault/{vaultId}/entry/{entryId}/agent/{agentId}/setting/{credentialKey}'));

            function listAgents(vId, eId, key) {
                return agentsRequest.get({
                    vaultId: vId,
                    entryId: eId,
                    credentialKey: key,
                });
            }

            function updateSettings(params) {
                return settingRequest.put({
                    vaultId: params.vId,
                    entryId: params.eId,
                    agentId: params.aId,
                    credentialKey: params.key,
                });
            }

            return {
                listAgents: function (vId, eId, key) {
                    return listAgents(vId, eId, key);
                },
                /**
                * update agent settings with vault entries
                * @param {Object} params
                * @config {String} vId   vaultId
                * @config {String} eId   entryId
                * @config {String} aId   agentId
                * @config {String} key   agent setting key
                * @config {String} [password]
                * @config {String} [privateKey]
                * @config {String} [token]
                */
                updateSettings: function (params) {
                    return updateSettings(params);
                },

            }
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaVault', ['SeaRequest', 'seaVaultHelper', 'seaVaultEntry', 'seaVaultUser', 'seaVaultUtil',
        function (SeaRequest, seaVaultHelper, seaVaultEntry, seaVaultUser, seaVaultUtil) {
            var requestVault = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}'));
            var requestAction = new SeaRequest(seaVaultHelper.getUrl('vault/{vId}/{action}'));
            var requestVaults = new SeaRequest(seaVaultHelper.getUrl('vault'));

            function listVaults(queryParams) {
                return requestVaults.get(queryParams);
            }

            function create(params) {
                return requestVaults.post(params);
            }
            
            function update(params) {
                return requestVault.put(params);
            }

            function get(vId) {
                return requestVault.get({
                    vId: vId,
                });
            }

            function destroy(vId) {
                return requestVault.del({
                    vId: vId
                });
            }
            
            function restore(params) {
                params = angular.extend({}, params, {action: 'restore'});
                return requestAction.post(params);
            }
           
            function unlock(params) {
                params = angular.extend({}, params, {action: 'unlock'});
                return requestAction.put(params);
            }

            return {
                list: function (queryParams) {
                    return listVaults(queryParams);
                },

                /**
                 * create vault
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [distributorId]
                 * @config {String} [userId]
                 * @config {Boolean} showPassword
                 * @config {String} authenticationMethod
                 * @config {String} name
                 * @config {String} description
                 * @config {String} password
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (vId) {
                    return get(vId);
                },
                
                /**
                 * update vault
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} [customerId]
                 * @config {String} [distributorId]
                 * @config {String} [userId]
                 * @config {Boolean} [showPassword]
                 * @config {String} [authenticationMethod]
                 * @config {String} [name]
                 * @config {String} [description]
                 * @config {String} password
                 */
                update: function (params) {
                    return update(params);
                },

                destroy: function (vId) {
                    return destroy(vId);
                },
                
                /**
                 * restore vault
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} restoreKey
                 */
                restore: function (params) {
                    return restore(params);
                },
                
                /**
                 * unlock vault
                 * @param {Object} params
                 * @config {String} vId
                 * @config {String} [password]
                 * @config {String} [privateKey]
                 */
                unlock: function (params) {
                    return unlock(params);
                },
                entry: seaVaultEntry,
                user: seaVaultUser,
                util: seaVaultUtil,
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUserGroup', ['SeaRequest',
    function seaUserGroup(SeaRequest) {
            var request = new SeaRequest('user/{uId}/group/{gId}');

            function list(uId) {
                return request.get({
                    uId: uId
                });
            }

            function addUser(uId, gId) {
                return request.put({
                    uId: uId,
                    gId: gId
                });
            }

            function removeUser(uId, gId) {
                return request.del({
                    uId: uId,
                    gId: gId
                });
            }

            return {
                list: function (uId) {
                    return list(uId);
                },

                /**
                 * add user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                add: function (uId, gId) {
                    return addUser(uId, gId);
                },

                /**
                 * remove user to group
                 * @param {String} gId
                 * @param {String} uId
                 */
                remove: function (uId, gId) {
                    return removeUser(uId, gId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUserLocation', ['SeaRequest',
        function seaUserLocation(SeaRequest) {
            var request = new SeaRequest('user/{uId}/location');

            function get(uId) {
                return request.get({
                    uId: uId
                });
            }
            function update(params) {
                return request.post(params);
            }

            return {
                /**
                 * get location
                 * @param {String} uId
                 */
                get: function (cId) {
                    return get(cId);
                },

                /**
                 * update location
                 * @param {Object} params
                 * @config {String} [uId]
                 * @config {Object} [geo]
                 * @config {Number} [geo.lat]
                 * @config {Number} [geo.lon]
                 * @config {Object} [geo.address]
                 * @config {String} [geo.address.country]
                 * @config {String} [geo.address.state]
                 * @config {String} [geo.address.postcode]
                 * @config {String} [geo.address.city]
                 * @config {String} [geo.address.road]
                 * @config {String} [geo.address.house_number]
                 */
                update: function (params) {
                    return update(params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUserSetting', ['SeaRequest',
    function seaUserSetting(SeaRequest) {
            var request = new SeaRequest('user/{uId}/setting');
            var requestMicroService = new SeaRequest('user/{uId}/setting', 'v3');

            function list(uId) {
                return request.get({
                    uId: uId
                });
            }

            function update(uId, settings) {
                settings = settings || {};
                settings.uId = uId;
                return requestMicroService.put(settings);
            }

            return {
                list: function (uId) {
                    return list(uId);
                },

                /**
                 * update user
                 * @param {String} uId
                 * @param {Object} settings
                 */
                update: function (uId, settings) {
                    return update(uId, settings);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUserSubstitude', ['SeaRequest',
    function seaUserSubstitude(SeaRequest) {
            var request = new SeaRequest('user/{uId}/substitude/{substitudeId}', 'v3');

            function set(uId, substId) {
                return request.put({
                    uId: uId,
                    substitudeId: substId
                });
            }

            function remove(uId) {
                return request.del({
                    uId: uId
                });
            }

            return {
                /**
                 * set a substitude
                 * @param {String} gId
                 * @param {String} uId
                 */
                set: function (uId, substId) {
                    return set(uId, substId);
                },

                /**
                 * remove substitude
                 * @param {String} uId
                 */
                remove: function (uId) {
                    return remove(uId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaUser', ['SeaRequest', 'seaUserGroup', 'seaUserLocation', 'seaUserSetting', 'seaUserSubstitude',
        function seaUser(SeaRequest, seaUserGroup, seaUserLocation, seaUserSetting, seaUserSubstitude) {
            var request = new SeaRequest('user/{uId}'),
                requestUser = new SeaRequest('user/{uId}/{sub}'),
                requestCustomer = new SeaRequest('user/{uId}/customer'),
                requestUsers = new SeaRequest('user');
            var requestMicroService = new SeaRequest('user/{uId}', 'v3'),
                requestUserMicroService = new SeaRequest('user/{uId}/{sub}', 'v3'),
                requestCustomerMicroService = new SeaRequest('user/{uId}/customer', 'v3'),
                requestUsersMicroService = new SeaRequest('user', 'v3');

            function create(params) {
                return requestMicroService.post(params);
            }

            function get(uId) {
                return request.get({
                    uId: uId
                });
            }

            function update(user) {
                return requestMicroService.put(user);
            }

            function destroy(uId) {
                return requestMicroService.del({
                    uId: uId
                });
            }

            function search(params) {
                return request.get(params);
            }

            function listCustomers(uId) {
                return requestCustomer.get({
                    uId: uId
                });
            }

            function listUsers(cId, includeLocation) {
                return requestUsers.get({
                    customerId: cId,
                    includeLocation: includeLocation
                });
            }

            function deactivateTwoFactor(uId, password) {
                return requestUser.del({
                    uId: uId,
                    password: password,
                    sub: 'twofactor'
                });
            }

            return {
                /**
                 * create user
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String} [prename]
                 * @config {String} [surname]
                 * @config {String} [email]
                 * @config {Number} [role]
                 * @config {String} [phone]
                 */
                create: function (params) {
                    return create(params);
                },

                get: function (gId) {
                    return get(gId);
                },

                /**
                 * update user
                 * @param {Object} user
                 * @config {String} [customerId]
                 * @config {String} [prename]
                 * @config {String} [surname]
                 * @config {String} [email]
                 * @config {Number} [role]
                 * @config {String} [phone]
                 */
                update: function (user) {
                    return update(user);
                },

                destroy: function (uId) {
                    return destroy(uId);
                },

                /**
                 * search users
                 * @param   {Object}   params
                 * @config  {String}   [query]
                 * @config  {String}   [customerId]
                 * @config  {Boolean}  [includeLocation]
                 */
                search: function (params) {
                    return search(params);
                },
                
                list: function(cId, includeLocation) {
                    return listUsers(cId, includeLocation);
                },
                
                group: seaUserGroup,
                location: seaUserLocation,
                setting: seaUserSetting,
                substitude: seaUserSubstitude,
                customer: {
                    list: function (uId) {
                        return listCustomers(uId);
                    }
                },
                twofactor: {
                    /**
                     * deactivate two-factor
                     * @param   {String}   uId
                     * @param   {String}   password
                     */
                    deactivate: function (uId, password) {
                        return deactivateTwoFactor(uId, password);
                    }
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchHistory', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
        function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/history/{action}'));

            function format(container) {
                if (!container.JobList) {
                    return container;
                }

                container.JobList.forEach(function (job) {
                    ['StartTime', 'EndTime', 'PlannedStartTime'].forEach(function (key) {
                        if (job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });

                return container;
            }

            function get(customerId, cId, params) {
                return list(customerId, [cId], params).then(function (history) {
                    return (history[0] || {}).JobList;
                });
            }

            function list(customerId, containerIds, params) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';

                params = params || {};

                if (params.index != null) {
                    query.Index = params.index;
                }

                if (params.count != null) {
                    query.Count = params.count;
                }

                if (params.from != null) {
                    query.From = params.from;
                }

                if (params.states != null) {
                    query.States = params.states;
                }

                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }

            return {
                get: function (customerId, cId, params) {
                    return get(customerId, cId, params);
                },

                list: function (customerId, containerIds, params) {
                    return list(customerId, containerIds, params);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchInstall', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
        function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/install/{action}'));

            function format(container) {
                if (!container.JobList) {
                    return container;
                }

                container.JobList.forEach(function (job) {
                    ['StartTime', 'EndTime', 'PlannedStartTime'].forEach(function (key) {
                        if (job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });

                return container;
            }

            function get(customerId, cId) {
                return list(customerId, [cId]).then(function (install) {
                    return install[0];
                });
            }

            function list(customerId, containerIds, params) {
                var query;
                params = params || {};

                if (params.jobIds) {
                    query = helper.getJobIds(params.jobIds);
                    query.action = 'software';
                } else {
                    query = helper.getContainerIds(containerIds);
                    query.action = 'get';
                }

                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }

            function create(params) {
                var customerId = params.customerId,
                    userId = params.userId,
                    containerId = params.containerId,
                    categories = params.categories,
                    software = params.softwareId,
                    cron = params.cron,
                    updateManualRelease = params.updateManualRelease,
                    postInstall = params.postInstall;

                var reqParams = {
                    Cron: cron,
                    UserId: userId
                };

                reqParams = angular.extend(reqParams, helper.getContainerIds(containerId));

                if (categories) {
                    reqParams.CategoryList = categories;
                }
                if (software) {
                    reqParams = angular.extend(reqParams, helper.getSoftwareIds(software));
                }
                if (updateManualRelease != null) {
                    reqParams.InstallManualReleaseSW = updateManualRelease;
                }
                if (postInstall == null) {
                    postInstall = 'NOTHING';
                }

                reqParams.PostAction = postInstall;

                return request.post(reqParams).then(helper.idListResult);
            }

            function destroy(customerId, jobId) {
                var query = helper.getJobIds(jobId);

                return request.del(query).then(helper.idListResult);
            }

            function getSoftware(customerId, jobId) {
                return listSoftware(customerId, [jobId]).then(function (install) {
                    return (install[0] || {});
                });
            }

            function listSoftware(customerId, jobIds) {
                var query = helper.getJobIds(jobIds);
                query.action = 'software';

                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },

                list: function (customerId, containerIds, params) {
                    return list(customerId, containerIds, params);
                },

                /**
                 * create scan job
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String|Array} [containerId]
                 * @config {String|Array} [softwareId]
                 * @config {Array} [categories]
                 * @config {String} [cron]
                 */
                create: function (params) {
                    return create(params);
                },

                destroy: function (customerId, jobId) {
                    return destroy(customerId, jobId);
                },

                getSoftware: function (customerId, jobId) {
                    return getSoftware(customerId, jobId);
                },

                listSoftware: function (customerId, jobIds) {
                    return listSoftware(customerId, jobIds);
                }
            };
        }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchReboot', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/reboot'));

            function create(params) {
                var customerId = params.customerId,
                    userId = params.userId,
                    containerId = params.containerId,
                    cron = params.cron,
                    action = params.action;

                var reqParams = {
                    Cron: cron,
                    Action: action,
                    UserId: userId
                };

                reqParams = angular.extend(reqParams, helper.getContainerIds(containerId));

                return request.post(reqParams).then(helper.idListResult);
            }

            function destroy(customerId, jobId) {
                var query = helper.getJobIds(jobId);

                return request.del(query).then(helper.idListResult);
            }

            return {
                /**
                 * create reboot job
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String|Array} [containerId]
                 * @config {String} [action]
                 * @config {String} [cron]
                 */
                create: function (params) {
                    return create(params);
                },

                destroy: function (customerId, jobId) {
                    return destroy(customerId, jobId);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchScan', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/scan/{action}'));
        
            function format(container) {
                if(!container.JobList) {
                    return container;
                }
                
                container.JobList.forEach(function (job) {
                    ['StartTime', 'EndTime'].forEach(function (key) {
                        if(job[key]) {
                            job[key] = new Date(job[key]);
                        }
                    });
                });
                
                return container;
            }
                
            function get(customerId, cId) {
                return list(customerId, [cId]).then(function (scan) {
                    return scan[0];
                });
            }

            function list(customerId, containerIds) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';
                
                return request.post(query).then(function (containers) {
                    containers.forEach(format);
                    return containers;
                });
            }
        
            function create(params) {
                var query = helper.getContainerIds(params.containerIds);
                query.Cron = params.cron;
                
                return request.post(query).then(helper.idListResult);
            }

            return {
                get: function (customerId, cId) {
                    return get(customerId, cId);
                },

                list: function (customerId, containerIds) {
                    return list(customerId, containerIds);
                },
                
                /**
                 * create scan job
                 * @param {Object} params
                 * @config {String} [customerId]
                 * @config {String|Array} [containerIds]
                 * @config {String} [cron]
                 */
                create: function (params) {
                    return create(params);
                }
            };
    }]);
})();
(function () {
    "use strict";

    angular.module('ngSeApi').factory('seaRemotingPatchSoftware', ['$http', 'SeaRequest', 'seaRemotingIasHelper',
    function seaRemotingPcvisit($http, SeaRequest, helper) {
            var request = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/container/software/{action}')),
                requestSoftware = new SeaRequest(helper.getUrl('seias/rest/seocc/patch/1.0/software/{method}/{action}'));

            function get(customerId, softwareId) {
                var query = helper.getSoftwareIds(softwareId);
                query.method = 'get';

                return requestSoftware.post(query).then(function (result) { return result[0]; });
            }
        
            function getByContainer(customerId, cId, params) {
                return listByContainer(customerId, [cId], params).then(function (software) {
                    return software[0];
                });
            }

            function listByContainer(customerId, containerIds, params) {
                var query = helper.getContainerIds(containerIds);
                query.action = 'get';

                params = params || {};

                if (params.installed == null) {
                    query.Installed = 'BOTH';
                } else {
                    query.Installed = params.installed ? 'TRUE' : 'FALSE';
                }

                if (params.blocked == null) {
                    query.Blocked = 'BOTH';
                } else {
                    query.Blocked = params.blocked ? 'TRUE' : 'FALSE';
                }

                return request.post(query);
            }

            function has(customerId, containerIds, softwareIds, params) {
                var query = helper.getContainerIds(containerIds);
                query.SoftwareIdList = helper.getSoftwareIds(softwareIds).SoftwareIdList;
                query.method = 'container';

                params = params || {};

                if (params.installed == null) {
                    query.Installed = 'BOTH';
                } else {
                    query.Installed = params.installed ? 'TRUE' : 'FALSE';
                }

                return requestSoftware.post(query);
            }

            function block(customerId, containerIds, softwareIds, isBlocked) {
                var query = angular.extend(
                    helper.getContainerIds(containerIds),
                    helper.getSoftwareIds(softwareIds)
                );
                query.action = 'block';
                query.Blocked = isBlocked;

                return request.post(query).then(helper.idListResult);
            }

            return {
                container: {
                    /**
                     * list software of container
                     * @param {String} customerId
                     * @param {String} containerId
                     * @param {Object} params
                     * @config {Boolean} [installed]
                     * @config {Boolean} [blocked]
                     */
                    get: function (customerId, containerId, params) {
                        return getByContainer(customerId, containerId, params);
                    },

                    list: function (customerId, containerIds, params) {
                        return listByContainer(customerId, containerIds, params);
                    }
                },

                get: function(customerId, softwareId) {
                    return get(customerId, softwareId);
                },
                
                /**
                 * find out if a container has a specific software installed
                 * @param {String} customerId
                 * @param {String} containerId
                 * @param {String} softwareId
                 * @param {Object} params
                 * @config {Boolean} [installed]
                 */
                has: function (customerId, containerId, softwareId, params) {
                    return has(customerId, containerId, softwareId, params);
                },

                /**
                 * block software on containers
                 * @param   {String}   customerId   
                 * @param   {String|Array}   containerIds 
                 * @param   {String|Array}   softwareIds  
                 * @param   {Boolean}  isBlocked
                 */
                block: function (customerId, containerIds, softwareIds, isBlocked) {
                    return block(customerId, containerIds, softwareIds, isBlocked);
                }
            };
    }]);
})();
//# sourceMappingURL=maps/ng-se-api.js.map