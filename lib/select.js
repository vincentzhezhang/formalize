var $ = require('jquery');
var eventy = require('eventy');

module.exports = function Select(element) {

  if (element.__initSelect) throw new Error('initialized element already');

  eventy(element);

  element.addEventListener('click', onClick, true);

  function onClick(event) {
    if (element.disabled) return;
    if ($(event.target).is('a')) {
      toggleOptions();
    } else {
      selectOption(event.target);
    }
  }

  function toggleOptions() {
    options().toggle();
  }

  function selectOption(ele) {
    $(ele).siblings().removeAttr('selected');
    $(ele).attr('selected', 'selected').trigger('change');
    element.setAttribute('value', ele.getAttribute('value'));
    element.firstElementChild.innerText = ele.textContent;
    toggleOptions();
  }

  function selectedOption() {
    return options().children('[selected]')[0];
  }

  function options() {
    return $(element).find('.options');
  }

  function getParents(ele) {
    var ancestors = [],
        parent = ele.parentNode;

    while (parent && (parent.nodeType !== parent.DOCUMENT_NODE)) {
      ancestors.push(parent);
      parent = parent.parentNode;
    }

    return ancestors;
  }

  function add(option, before) {
    hasValidIndex = options().map(function(i,e){return i}).index(before) != -1;
    if (hasValidIndex) {
      $(option).insertBefore(options().children()[before]);
    } else {
      $(option).insertAfter(options().children().slice(-1));
    }

  }

  function remove(index) {
    options().children()[index].remove();
  }


  /*
    Sets or returns whether this select is disabled or not
    @return Boolean
  */
  Object.defineProperty(element, 'disabled', {
    get: function () {
      if (element.hasAttribute('disabled')) return true;
      else return false;
    },

    set: function (value) {
      if (value) {
        element.setAttribute('disabled', '');
        element.trigger('disabled').trigger('change');
      } else {
        element.removeAttribute('disabled');
        element.trigger('enabled').trigger('change');
      }
    }
  })

  /*
    Returns a reference to the form that contains this select
    @return Object
  */
  Object.defineProperty(element, 'form', {
    value: (function () {
      var parents = getParents(element);
      for (var i in parents) {
        if (parents[i].tagName === 'FORM') return parents[i];
      }
      return null;
    }()),

    id: function () {
      debugger;
    }
  })

  Object.defineProperty(element, 'options', {
    value: {
      length: (function() {return options().length}()),
      selectedIndex: (function() {
        return options().children().index(selectedOption());
      }()),
      add: function(ele, index) {
        add(ele, index);
      },
      item: function(index) {
        return options().children()[index];
      },
      namedItem: function(name) {
        return options().children('[name=' + name + ']');
      },
      remove: function(index) {
        remove(index);
      }
    }
  })

  /*
    Returns the length of options this select has
    @return number
  */
  Object.defineProperty(element, 'length', {
    value: (function () {
      return options().children().length;
    }())
  })

  /*
    Returns which type of this select is [singular/multiple] 
    @return boolean
  */
  Object.defineProperty(element, 'multiple', {
    value: (function () {
      if (element.hasAttribute('multiple')) return true;
      else return false;
    }())
  })

  /*
    Sets or returns the value of the name atrribute of this select
    @return String
  */
  Object.defineProperty(element, 'name', {
    get: function () {
      if (element.hasAttribute('name')) return element.getAttribute('name');
      else return '';
    },

    set: function (value) {
      element.setAttribute('name', value);
      element.trigger('change');
    }
  })

  /*
    Sets or returns the checked state of this select
    @return String
  */
  Object.defineProperty(element, 'selectedIndex', {
    get: function () {
      return options().children().index(selectedOption());
    }
  })

  /*
    Returns the size of options this select has
    @return number
  */
  Object.defineProperty(element, 'size', {
    value: (function () {
      return options().children().length;
    }())
  })

  /*
    Returns which type of form element this select is
    @return String
  */
  Object.defineProperty(element, 'type', {
    value: 'select'
  })

  /*
    Sets or returns the value of the value atrribute of the option
    @return String
  */
  Object.defineProperty(element, 'value', {
    get: function () {
      if (element.hasAttribute('value')) return element.getAttribute('value');
      else return '';
    },

    set: function (value) {
      element.setAttribute('value', value);
      element.trigger('change');
    }
  })

  /*
    add an new option element into existing options
  */
  element.add = function(option, before) {
    /*
      option Required. Specifies the option to add. Must be an option or optgroup element
      before Required. Where to insert the new option (null indicates that the new option will be inserted at the end of the list)
    */
    add(option, before);
  }

  /*
    remove an option element from options
  */
  element.remove = function(index) {
    //remove option[index]
    remove(index);
  }

  /**
   * For some browsers that don't redraw the element after changing its attribute
   */
  element.on('change', function () {
    element.className = element.className;
  });

  element.__initSelect = true;
  return element;
}
