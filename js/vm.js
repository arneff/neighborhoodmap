function AppViewModel() {
  //data
  var self = this;
  self.list = ko.observableArray([{name:'Iron Works BBQ'}, {name:'Franklin Barbecue'}, {name:'La Barbecue'}, {name:'Stubb\'s Bar-B-Q'}, {name:'Kerlin BBQ'}]);
  self.chosenListId = ko.observable();

  //https://stackoverflow.com/questions/34584181/create-live-search-with-knockout?rq=1
  self.filter = ko.observable();
  self.listVisible = ko.computed(function() {
    return self.list().filter(function(list) {
      if (!self.filter() || list.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1) {
        return list;
      }
    });

  }, this);

  //behaviors
  self.goToList = function(list) {
  self.chosenListId(list);
  }



};

ko.applyBindings(new AppViewModel());
