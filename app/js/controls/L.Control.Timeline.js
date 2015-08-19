define('controls/L.Control.Timeline', [
      'leaflet'
    , 'd3'
], function (L,d3) {
    if (L.Control.Timeline) return L;
    L.Control.Timeline = L.Control.extend({
          options: {
                //position: 'topleft'
                orientation: 'left'
              , height: 500
              , width: 100
              , id : 'timeline-container'
              , margin: { left: 3, right: 3, top: 10, bottom: 10 }
              , collapsed: false
              , item : {minHeight:1}
              , on : {
                  brushend: function(brushed) {
                      console.log(brushed);
                  }
              }
        }
        , initialize : function(options) {
            L.Util.setOptions(this, options);
            this._container = L.DomUtil.get(this.options.id);
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
            this._addItemsToTimeline();
        }
        , _addItemsToTimeline: function() {
            var that = this;
            var innerHeight = this.options.height - this.options.margin.top   - this.options.margin.bottom;
            var innerWidth  = this.options.width  - this.options.margin.right - this.options.margin.left;

            var xScale = this._xScale = d3.scale.linear()
                .range([0,innerWidth]);

            var yScale = this._yScale = d3.scale.linear()
                .domain([this._source.start,this._source.end])
                .range([0,innerHeight]);

            var timeline = this._timeline = d3.select('#timeline-container')
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

            var brush = d3.svg.brush()
                .y(yScale)
                .on('brushend', function(){
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

            this._handleTimelineMouseEvents();               
        }
        , _handleTimelineMouseEvents : function() {
            if (!L.Browser.touch) {
                L.DomEvent.disableClickPropagation(this._container);
            } else {
                L.DomEvent.on(this._container, 'click', L.DomEvent.stopPropagation);
            }
        }
    });
    L.control.timeline = function(options) {
        return new L.Control.Timeline(options);
    };
});
