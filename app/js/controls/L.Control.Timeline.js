define('controls/L.Control.Timeline', [
      'leaflet'
    , 'd3'
], function (L,d3) {
    if (L.Control.Timeline) return L;
    L.Control.Timeline = L.Control.extend({
          options: {
                orientation : 'left'
              , height      : 500
              , width       : 100
              , margin      : { left: 3, right: 3, top: 10, bottom: 5 }
              , collapsed   : true
              , item        : {minHeight:1}
              , on          : null
              , title       : 'Timeline'
              , position    : 'topleft'
        }
        , initialize : function(map, source, options) {
            var that = this;
            L.Util.setOptions(this, options);
            this._map = map;
            this._source = source;
            var container = this._container = L.DomUtil.create('div','leaflet-control-timeline leaflet-control');
            if (this.options.collapsed) {
                L.DomUtil.addClass(container, 'leaflet-control-timeline-collapsed');
                var toggle = this._toggle = L.DomUtil.create('a', 'leaflet-control-timeline-toggle', container);
                toggle.title = this.options.title;
                toggle.link = '#';
                var expand = function() { that._expand(); };
                if (L.Browser.touch) {
                    L.DomEvent
                        .on(toggle, 'click', L.DomEvent.stop)
                        .on(toggle, 'click', expand, this);
                } else {
                    L.DomEvent.on(toggle, 'click', expand);
                }
            } else {
                L.DomUtil.addClass(container, 'leaflet-control-timeline-expanded');
            }
            if (!L.Browser.touch) {
                L.DomEvent.disableClickPropagation(this._container);
            } else {
                L.DomEvent.on(this._container, 'click', L.DomEvent.stopPropagation);
            }
            return container;
        }
        , onRemove: function() {
            // do any cleanup here
        }
        , onAdd: function(map) {
            return this._container;
        }
        , _expand: function() {
            var that = this;
            if (that._expanded) return;
            that._expanded = true;
            this._map.on('click', this._collapse, this);

            L.DomUtil.removeClass(this._container, 'leaflet-control-timeline-collapsed');
            L.DomUtil.addClass(this._container, 'leaflet-control-timeline-expanded');

            if (this._timeline) return;

            var innerHeight = this.options.height - this.options.margin.top   - this.options.margin.bottom;
            var innerWidth  = this.options.width  - this.options.margin.right - this.options.margin.left;

            var xScale = this._xScale = d3.scale.linear()
                .range([0,innerWidth]);

            var yScale = this._yScale = d3.scale.linear()
                .domain([this._source.start,this._source.end])
                .range([0,innerHeight]);

            var timeline = this._timeline = d3.select('.leaflet-control-timeline')
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
                .data(this._source.getItems())
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
            if (!this._expanded) return;
            if  (this.options.on.collapse || typeof this.options.on.collapse === 'function') 
                this.options.on.collapse();
            //document.getElementById('timeline').remove();
            this._expanded = false;
            L.DomUtil.addClass(this._container, 'leaflet-control-timeline-collapsed');
            L.DomUtil.removeClass(this._container, 'leaflet-control-timeline-expanded');
            this._map.off('click', this._collapse, this);
        }
    });
    L.control.timeline = function(map,source,options) {
        return new L.Control.Timeline(map,source,options);
    };
});
