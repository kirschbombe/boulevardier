define('controls/L.Control.Timeline', [
      'leaflet'
    , 'd3'
], function (L,d3) {
    if (L.Control.Timeline) return L;
    L.Control.Timeline = L.Control.extend({
          options: {
                orientation: 'left'
              , height: 500
              , width: 100
              , sel : '.leaflet-control-timeline'
              , margin: { left: 3, right: 3, top: 10, bottom: 10 }
              , collapsed: false
              , item : {minHeight:1}
              , on : null // brushend: null
        }
        , initialize : function(map, options) {
            L.Util.setOptions(this, options);
            this._map = map;
            this._container = d3.select(this.options.sel);
        }
        , onRemove: function() {
            // do any cleanup here
        }
        , onAdd: function(map) {
            return this._container;
        }
        , addData: function(source) {
            this._source = source;
            this._items = source.getItems();
        }
        , expand: function() {
            var that = this;
            
            if (that._expanded) return;
            that._expanded = true;

            var innerHeight = this.options.height - this.options.margin.top   - this.options.margin.bottom;
            var innerWidth  = this.options.width  - this.options.margin.right - this.options.margin.left;

            that._handleTimelineMouseEvents();
            L.DomUtil.removeClass(this._container[0][0], 'leaflet-control-timeline-collapsed');
            L.DomUtil.addClass(this._container[0][0], 'leaflet-control-timeline-expanded');

            var xScale = this._xScale = d3.scale.linear()
                .range([0,innerWidth]);

            var yScale = this._yScale = d3.scale.linear()
                .domain([this._source.start,this._source.end])
                .range([0,innerHeight]);

            var timeline = this._timeline = this._container
                .append('svg')
                .attr('id', 'timeline')
                .attr('height', this.options.height)
                .attr('width', this.options.width);

            var band = timeline.append('g')
                .attr('id','band')
                .attr('width', (innerWidth/2 - this.options.margin.right))
                .attr('height', innerHeight)                
                .attr('transform', 
                      'translate(' + .25*innerWidth + ',' + this.options.margin.top +  ')'
                    + ' scale(.75 1.0)'
                );

            var items = band.selectAll('g')
                .data(this._items)
                .enter().append('rect')
                .attr('class','timeline-item')
                .attr('height', function(d) {
                    return d3.max([
                          that.options.item.minHeight
                        , yScale(d.duration())
                    ]);
                })
                .attr('width',innerWidth)
                .attr('transform', function(d) {
                    return 'translate(0, ' + yScale(d.start) + ')';
                });

            var brush = this._brush = d3.svg.brush()
                .y(yScale)
                .on('brushend', function() {
                    var extStart = yScale(brush.extent()[0]);
                    var extEnd   = yScale(brush.extent()[1]);
                    var results = {
                          clear: false
                        , selected : []
                    };
                    if (extStart !== extEnd) {
                        d3.select('#band').selectAll('rect.timeline-item').each(function(i){
                            if ((yScale(i.start) <= extEnd) && (yScale(i.end)   >= extStart))
                                results.selected.push(i);
                        });
                    } else {
                        results.clear = true;
                    }
                    that.options.on.brushend(results);
                });

            var yBrush = band.append('svg')
                .attr('id','brush')
                .call(brush);
            yBrush.selectAll('rect')
                .attr('width',innerWidth);

            var yAxis = timeline.append('g')
                .attr('id','axis')
                .attr('transform','translate(' + ((.25*innerWidth) - this.options.margin.left) + ',' + this.options.margin.top +  ')');

            var axis = d3.svg.axis()
                .scale(yScale)
                .orient(this.options.orientation)
                .tickSize(6, 0)
                .tickValues(this._source.tickValues())
                .tickFormat(function(item){
                    return that._source.tickFormat(item);
                });
            yAxis.call(axis);
        }
        , _collapse : function() {
            this.options.on.collapse(); // TODO: # d3.svg.brush() destructor?
            this._container.select('svg').remove();
            this._expanded = false;
        }
        , _handleTimelineMouseEvents : function() {
            // prevent the map from being reachable by mouse events when 
            // timeline is open
            if (!L.Browser.touch) {
                L.DomEvent.disableClickPropagation(this._container[0][0]);
            } else {
                L.DomEvent.on(this._container[0][0], 'click', L.DomEvent.stopPropagation);
            }
			this._map.on('click', this._collapse, this);
        }
    });
    L.control.timeline = function(map,options) {
        return new L.Control.Timeline(map,options);
    };
});
