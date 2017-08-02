/**
* @class PrettyJSON.view.Node
* @extends Backbone.View
* 
* @author #rbarriga
* @version 0.1
*
*/
PrettyJSON.view.Node = Backbone.View.extend({
    tagName:'span',
    data:null,
    level:1,
    path:'',
    type:'',
    size:0,
    isLast:true,
    rendered:false,
    events:{
        'click .node-bracket': 'collapse',
        'mouseover .node-container': 'mouseover',
        'mouseout .node-container': 'mouseout'
    },
    initialize:function(opt) {
        this.options = opt;
        this.data = this.options.data;
        this.compareTo = this.options.compareTo
        this.level = this.options.level || this.level;
        this.compare = this.options.compare || false;
        this.path = this.options.path;
        this.isLast = _.isUndefined(this.options.isLast) ?
            this.isLast : this.options.isLast;
        this.dateFormat = this.options.dateFormat;
        this.counterpart = this.options.counterpart
        this.importantInfo = this.options.importantInfo

        var m = this.getMeta();
        this.type = m.type;
        this.size = m.size;

        //new instance.
        this.childs = [];
        this.render();

        //Render first level.
        if (this.level == 1)
            this.show();
            if(this.counterpart !== undefined){
                for(var i = 0; i < this.childs.length; i++) {
                    this.childs[i].counterpart = this.counterpart.childs[i]
                    this.counterpart.childs[i].counterpart = this.childs[i]
                }
            }

    },
    getMeta: function(){
        var val = {
            size: _.size(this.data),
            type: _.isArray(this.data) ? 'array' : 'object',
        };
        return val;
    },
    elements:function(){
        this.els = {
            container:$(this.el).find('.node-container'),
            contentWrapper: $(this.el).find('.node-content-wrapper'),
            top:$(this.el).find('.node-top'),
            ul: $(this.el).find('.node-body'),
            down:$(this.el).find('.node-down')
        };
    },
    render:function(){
        this.tpl = _.template(PrettyJSON.tpl.Node);
        $(this.el).html(this.tpl);
        this.elements();

        var b = this.getBrackets();
        this.els.top.html(b.top);
        this.els.down.html(b.bottom);

        this.hide();

        return this;
    },
    renderChilds:function(){
        var count = 1;
        
        _.each(this.data, function(val, key){
            
            if(this.compare && this.compareTo !== null){
                var compareToVal = this.compareTo[key];
            } else {
                var compareToVal = null;
            }
                
            var isLast = (count == this.size);
            count = count + 1;

            var path = (this.type == 'array') ? 
                this.path + '[' + key + ']' :
                this.path + '.' + key;
            
            var opt = {
                key: key,
                data: val,
                compareTo: compareToVal,
                compare: this.compare,
                parent: this,
                path: path,
                importantKeys: this.importantInfo,
                level: this.level + 1,
                dateFormat: this.dateFormat,
                isLast: isLast
            };

            var child = (PrettyJSON.util.isObject(val) || _.isArray(val) ) ? 
                new PrettyJSON.view.Node(opt) : 
                new PrettyJSON.view.Leaf(opt);

            child.on('mouseover', function(e, path){
                this.trigger("mouseover", e, path);
            }, this);
            child.on('mouseout',function(e){
                this.trigger("mouseout", e);
            }, this);

            //body ul 
            var li = $('<li/>');

            var colon = '&nbsp;:&nbsp;';
            var left = $('<span />');
            var right =  $('<span />').append(child.el);
            (this.type == 'array') ? left.html('') : left.html(key + colon);
            
            if(this.compare){
                if(compareToVal === val) {
                    left.attr('class', 'same');
                } else if(compareToVal === null) {
                    left.attr('class', 'new');
                } else if(val === null) {
                    left.attr('class', 'missing');
                } else if(typeof val === 'object') {
                    if (JSON.stringify(val) === JSON.stringify(compareToVal)) {
                        left.addClass('same');
                    } else {
                        left.addClass('different');
                    }
                } else {
                    left.addClass('different');
                }
            }
            
            if(this.importantInfo && this.importantInfo.includes(key)) {
                left.addClass('important')
            }
            
            left.append(right);
            li.append(left);

            this.els.ul.append(li);

            //references.
            child.parent = this;
            this.childs.push(child);

        }, this);
    // eof iteration
    },
    isVisible:function(){
        return this.els.contentWrapper.is(":visible");
    },
    collapse:function(e){
        e.stopPropagation();
        if(this.isVisible()) {
            this.hide();
            if(this.counterpart !== undefined && this.counterpart.data !== null){
                this.counterpart.hide();
            }
        } else {
            this.show();
            if(this.counterpart !== undefined && this.counterpart.data !== null){
                
                if(!this.counterpart.rendered){
                    this.counterpart.renderChilds();
                    this.counterpart.rendered = true
                }
                for(var i = 0; i < this.childs.length; i++) {
                    this.childs[i].counterpart = this.counterpart.childs[i]
                    this.counterpart.childs[i].counterpart = this.childs[i]
                }
                this.counterpart.show();
            }
        }
        this.trigger("collapse",e);
    },
    show: function(){

        //lazy render ..
        if(!this.rendered){
            this.renderChilds();
            this.rendered = true;
        }

        this.els.top.html(this.getBrackets().top);
        this.els.contentWrapper.show();
        this.els.down.show();
    },
    hide: function(){
        var b = this.getBrackets();

        this.els.top.html(b.close);
        this.els.contentWrapper.hide();
        this.els.down.hide();
    },
    getBrackets:function(){
        var v = {
            top:'{',
            bottom:'}',
            close:'{ ... }'
        };
        if(this.type == 'array'){
            v = {
                top:'[',
                bottom:']',
                close:'[ ... ]'
            };
        };

        v.bottom = (this.isLast) ? v.bottom : v.bottom + ',';
        v.close = (this.isLast) ? v.close : v.close + ',';

        return v;
    },
    mouseover:function(e){
        e.stopPropagation();
        this.trigger("mouseover",e, this.path);
    },
    mouseout:function(e){
        e.stopPropagation();
        this.trigger("mouseout",e);
    },
    expandAll:function (){
        _.each(this.childs, function(child){
            if(child instanceof PrettyJSON.view.Node){
                child.show();
                child.expandAll();
            }
        },this);
        this.show();
    },
    collapseAll:function(){
        _.each(this.childs, function(child){
            if(child instanceof PrettyJSON.view.Node){
                child.hide();
                child.collapseAll();
            }
        },this);

        if(this.level != 1)
            this.hide();
    },
});
