/* jshint devel:true */
const getJson = url => {
    return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            resolve(JSON.parse(request.response));
          } else {
            reject(Error(JSON.parse(request.statusText)));
          }
        };

        request.onerror = function() {
          reject(Error("Network Error"));
        };

        request.send();
    });
};

const getLink = (url) => {
    let splited = url.split('/');
    let id = splited[splited.length-1];

    return '/detail.html?id=' + id;
};

function AppViewModel() {
    var self = this;
    self.albums = ko.observableArray([]);

    getJson('https://api.discogs.com/artists/82730/releases')
        .then(value => {
            let albums = value.releases;
            albums.forEach((album) => {
                album.link = getLink(album.resource_url);
                this.albums.push(album);
            });
        })
        .catch(err => console.log(err));

    let id = document.location.search.split('=')[1];
    self.details = ko.observable({});

    if (id){
        getJson('https://api.discogs.com/releases/'+id)
            .then(value => {
                self.details = ko.observable(value);
                console.log(self.details());
            })
            .catch(err => console.log(err));
    }
}

ko.applyBindings(new AppViewModel());
