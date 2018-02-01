function AppViewModel() {
  //data
  var self = this;
  self.list = ko.observableArray([{name:'Iron Works BBQ'}, {name:'Franklin Barbecue'}, {name:'La Barbecue'}, {name:'Stubb\'s Bar-B-Q'}, {name:'Kerlin BBQ'}]);
  self.chosenListId = ko.observable();
  self.filter = ko.observable();



  //behaviors
  self.goToList = function(list) {
    self.chosenListId(list)

  }
  //if nothing is in the filter input return the list otherwise return list based on input
  //https://stackoverflow.com/questions/34584181/create-live-search-with-knockout?rq=1

  self.listVisible = ko.computed(function() {
    return self.list().filter(function(list) {
      if (!self.filter() || list.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1) {
        return list;
      }
    });

  }, this);





};

ko.applyBindings(new AppViewModel());
