var should = chai.should();

describe("Node", function() {
	describe("Initialization", function() {
		it("should initialize with no options", function() {
			var node = new PrettyJSON.view.Node({});
		});
		it("should initialize with just data", function() {
			var node = new PrettyJSON.view.Node({data: data});
			node.data.should.equal(data);
		});
		it("should initialize with just an element", function() {
			var node = new PrettyJSON.view.Node({el: el});
			
		});
		it("should initialize with an object to compare against", function() {
			var node = new PrettyJSON.view.Node({compareTo: data});
			node.compareTo.should.equal(data);
		});
		it("should initialize with important info", function() {
			var importantInfo = ["wow"]
			var node = new PrettyJSON.view.Node({importantInfo: importantInfo});
			node.importantInfo.should.equal(importantInfo);
		});
		it("should initialize with a counterpart", function() {
			var node1 = new PrettyJSON.view.Node({});
			var node2 = new PrettyJSON.view.Node({counterpart: node1});
			node1.counterpart.should.equal(node2);
			node2.counterpart.should.equal(node1);
		});
	});
	describe("Rendering", function() {
		beforeEach(function() {
			this.data = {
				name:'John Smith',
				age: 22,
				children:[{name:'Jack', age:5}, {name:'Ann', age:8}],
				wife: {name: "Jack"}
			}
			this.node = new PrettyJSON.view.Node({data: this.data});
			this.node.expandAll();
		});
		it("should render with proper levels", function() {
			this.node.level.should.equal(1);
			this.node.childs[0].level.should.equal(2);
			this.node.childs[2].childs[0].level.should.equal(3);
			this.node.childs[2].childs[0].childs[0].level.should.equal(4);
		});
		it("should render with proper parents", function() {
			this.node.childs[0].parent.should.equal(this.node);
		});
		it("should render with proper structure", function() {
			this.node.childs[0].data.should.equal(data["name"])
			this.node.childs[1].data.should.equal(data["age"])
			this.node.childs[2].childs[0].childs[0].data.should.equal(data["children"][0]["name"])
			this.node.childs[2].childs[0].childs[1].data.should.equal(data["children"][0]["age"])
			this.node.childs[3].isLast.should.equal(true)
		});
	});
	describe("Comparing", function() {
		beforeEach(function() {
			this.data1 = {
				name:'John Smith',
				age: 22,
				children:[{name:'Jack', age:5}, {name:'Ann', age:8}],
				wife: {name: "Jack"}
			}
			this.data2 = {
					name:'John Smith',
					age: 2,
					children:[{name:'Jack', age:5}, {name:'An', age:8}],
					wife: null
				}
			this.other = new PrettyJSON.view.Node({data: this.data2, compareTo: this.data1});
			this.node = new PrettyJSON.view.Node({data: this.data1, compareTo: this.data2, importantInfo: ["name"]});
			this.node.expandAll();
		});
		it("should correctly identify identical elements", function() {
			this.node.els.ul[0].childNodes[0].childNodes[0].className.should.equal("same important");
			var children = this.node.childs[2];
			children.childs[1].els.ul[0].childNodes[1].childNodes[0].className.should.equal("same")
			children.childs[0].els.ul[0].childNodes[0].childNodes[0].className.should.equal("same")
			children.childs[0].els.ul[0].childNodes[1].childNodes[0].className.should.equal("same")
			
		});
		it("should correctly identify different elements", function() {
			this.node.els.ul[0].childNodes[1].childNodes[0].className.should.equal("different");
			this.node.els.ul[0].childNodes[2].childNodes[0].className.should.equal("different")
			var children = this.node.childs[2];
			children.childs[1].els.ul[0].childNodes[0].childNodes[0].className.should.equal("different")
		});
		it("should correctly identify new and missing elements", function() {
			var wife = this.node.childs[3];
			wife.els.ul[0].childNodes[0].childNodes[0].className.should.equal("new")
			this.other.els.ul[0].childNodes[3].childNodes[0].className.should.equal("missing")
		});
		it("should correctly identify important elements", function() {
			this.node.els.ul[0].childNodes[0].childNodes[0].className.should.equal("same important");
		});
	});
	describe("Linking", function() {
		beforeEach(function() {
			this.data1 = {
					name:'John Smith',
					age: 22,
					children:[{name:'Jack', age:5}, {name:'Ann', age:8}],
					wife: {name: "Jack"}
				}
				this.data2 = {
						name:'John Smith',
						age: 2,
						children:[{name:'Jack', age:5}, {name:'An', age:8}],
						wife: null
					}
				this.other = new PrettyJSON.view.Node({data: this.data2});
				this.node = new PrettyJSON.view.Node({data: this.data1, counterpart: this.other});
		});
		it("should link correctly with another node", function() {
			this.node.linked.should.equal(true);
			this.other.linked.should.equal(true);
			
			this.node.childs[2].linked.should.equal(false);
			this.node.childs[2].show()
			this.node.childs[2].linked.should.equal(true);
			
			this.node.childs[2].childs[0].linked.should.equal(false);
			this.node.childs[2].childs[0].show()
			this.node.childs[2].childs[0].linked.should.equal(true);
			
			this.node.childs[2].childs[1].linked.should.equal(false);
			this.node.childs[2].childs[1].show()
			this.node.childs[2].childs[1].linked.should.equal(true);
			
			this.node.counterpart.should.equal(this.other);
			this.node.childs[2].counterpart.should.equal(this.other.childs[2])
			this.other.childs[2].counterpart.should.equal(this.node.childs[2])
			this.node.childs[2].childs[0].counterpart.should.equal(this.other.childs[2].childs[0]);
			this.node.childs[2].childs[1].counterpart.should.equal(this.other.childs[2].childs[1]);
			
			should.not.exist(this.node.childs[0].counterpart);
			should.not.exist(this.node.childs[1].counterpart);
			should.not.exist(this.node.childs[3].counterpart);
			should.not.exist(this.node.childs[2].childs[0].childs[0].counterpart);
			should.not.exist(this.node.childs[2].childs[0].childs[1].counterpart);
			should.not.exist(this.node.childs[2].childs[1].childs[0].counterpart);
			should.not.exist(this.node.childs[2].childs[1].childs[1].counterpart);
		});
		it("should render when the counterpart is rendered", function() {
			should.not.exist(this.node.childs[2].childs[0])
			should.not.exist(this.node.childs[2].childs[1])
			this.node.childs[2].rendered.should.equal(false);
			
			this.other.childs[2].show();
			should.exist(this.node.childs[2].childs[0])
			should.exist(this.node.childs[2].childs[1])
			this.node.childs[2].rendered.should.equal(true);
		});
	})
});