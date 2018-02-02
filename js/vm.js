function AppViewModel() {
  //data
  var self = this;
  self.list = ko.observableArray([
    {name:'Iron Works BBQ', location: {lat: 30.2624539, lng: -97.7393236}},
    {name:'Franklin Barbecue', location: {lat: 30.2701257, lng: -97.7314623}},
    {name: 'Rollin Smoke BBQ', location: {lat:30283546, lng: -9773622}},
    {name:'Stubb\'s Bar-B-Q', location: {lat: 30.2686802, lng: -97.7360462}},
    {name:'Kerlin BBQ', location: {lat: 30.2581486, lng: -97.7261113}}
  ]);


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
