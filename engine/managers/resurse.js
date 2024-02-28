(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url.toLowerCase()] = img;

                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            resourceCache[url.toLowerCase()] = false;
            img.src = url;
        }
    }

    function download(url){
      var img = new Image();
      resourceCache[url.toLowerCase()] = img;
      img.src = url;
    }

    function get(url) {
        return resourceCache[url.toLowerCase()];
    }

    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady,
        download:download
    };
})();

function getTex(name)
{
	return resources.get('textures/'+name+".png");
}

function getTexs(name,count)
{
	let arr = [];

	for(let i = 0; i < count;i++)
	{
		arr.push(resources.get('textures/'+name+i+".png"));
	}

	return arr;
}

function getTexs2(name,start,count)
{
	let arr = [];

	for(let i = start; i < count;i++)
	{
		arr.push(resources.get('textures/'+name+i+".png"));
	}

	return arr;
}

function getTile(map, tileID)
{
	return resources.get('textures/'+map+"/tile_"+tileID+".png");
}
