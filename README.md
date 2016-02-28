**Boulevardier** is an application for publishing TEI-encoded literary documents with associated geographic data to the web. The [Literary Paris](http://kirschbombe.github.io/literaryparis/) page uses it to publish content from the PSU course of the same name, and its [gh-pages](https://github.com/kirschbombe/literaryparis/tree/gh-pages) branch may be consulted for M&T usage and site configuration.

[![Build Status](https://travis-ci.org/rnathanday/boulevardier.svg?branch=master)](https://travis-ci.org/rnathanday/boulevardier)

##Setup

To use Boulevardier for your content, visit the project [release page](https://github.com/kirschbombe/boulevardier/releases/tag/0.1.0) to download the current release version of the application. The release contains minified versions of the application resources and sample content, but requires some configuration to make your content available.

Once on your local machine and uncompressed, the M&T release should successfully present the example content. If not, confirm that:

 - it is located in a directory that is accessible to your webserver
 - it has filesystem permissions consistent with viewing in a browser
 - it has been navigated to using an "http://" URL rather than a "file:///" URL

After a successful load, you should see a map with controls, a title page, and a menu button.

##Site configuration

###Articles

The content for the example pages are located in the directory `example/articles`. In addition to replacing the articles, the application configuration file must be updated with the filenames of your articles. It is located at `config/site.json`. Your articles should be added to the following configuration block in the list at `articles.files`:

```
  "articles" : {
    "pathBase"  : "example/articles/",
    "files"     : [
        "railroad-park.xml"
    ]
   }
```
If the article directory is renamed/moved, the value at `articles.pathBase` must be updated. The directory path is relative to the `index.html` file, and the directory must be accessible by your webserver and have adequate permissions.

###index.html

The index page for the site has two configuration points, the CSS stylesheet used for the pages and the Javascript script used to launch the application. The CSS stylesheet is initially configured to be located relative to the index.html file in the `app/css/` subdirectory:  

```<link rel="stylesheet" href="app/css/main.css">```

The Javascript loader is also initially configured to be located relative to the index.html file:

```<script id="main" data-main="app/js/main" data-config="config/site.json" src="..."></script>```

Other than the URL of the Javascript file, there are two configuration points which must be kept in sync with your layout. The `@data-main` attribute points to the Javascript file for the M&T application, minus its `.js` extension. The `@data-config` attribute points to the site configuration file mentioned in the previous section, including its `.json` extension.

##Map configuration

The map for the site, `config/map.json`, has a configuration file with a number of items that must be updated to have your desired location displayed:

 * `tileLayer.url`: the parameterized URL provided by your map service
 * `tileLayer.opts.attribution`: any attribution statement you would like to have added to the map
 * `view.lat`, `view.lng`, `view.zoom`: the starting latitude, longitude, and zoom level of your map (optional)
 * `icon.iconUrl`: the location of your map marker icon, relative to the index.html file

If values for `view` are not provided, the map will be automatically configured to display available markers.

In addition to updating these values, any other map parameter may be adjusted in the file. The parameters are provided to the Leaflet map constructor as follows:

```var map = new L.Map(config.id, config.map);```

The documentation for Leaflet configuration may be found at that site [http://leafletjs.com/reference.html](http://leafletjs.com/reference.html).

##Pages

Configuration of the site's title, article, and other pages is done through the `config/site.json` file. That file contains a number of values and definitions for named pages.

 * `pages.pathBase`: path, relative to index.html, of the directory containing site pages
 * `pages.home`: the name of the page to use for the home/initial page when the index.html is loaded
 * `pages.routes`: a mapping of url fragments to application handlers for pages

The `pages.pages` block contains individual, named page definitions. For example, the "map-title" page (which is the home page for the example), is composed of three application `views`, which are responsible for programmatic page layout, and a page `partial`, which corresponds to the contents of an HTML file:

```
"map-title" : [
      { "view"    : "views/map"   }
    , { "view"    : "views/issue" }
    , { "partial" : { "el"   : "#article"
                    , "page" : "title.html" } }
    , { "view"    : "views/menu"  }
],
```

The page partial item indicates that the content in the file `../../pages/title.html` is to be attached to the element `div#article`, which happens to be added to the DOM by the `views/issue` view. This aspect of site configuration reflects the v0.1.0 status of the project and is subject to change in future versions.

##Menu

The dropdown menu for the site is configured as a list of items in the site configuration file:

```
  "menu"        : [
    {  "type"    : "page",
       "label"   : "Home",
       "href"    : "",
       "partial" : "partials/menu/page.html"     },
```
Each of these items, having item type "page" or "menu", correspond to a label/href pair to be reachable by the application. Note that the "href" value is taken to be a page fragment and not a full URL. For example, the href value "about" would result in the menu item causing a load of "http://localhost/boulevardier/index.html#about".

## Development
To modify or extend Boulevardier, please refer to this wiki page: [Boulevardier development](https://github.com/kirschbombe/boulevardier/wiki/developing).

