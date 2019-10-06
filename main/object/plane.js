/**
 * 说明：创建一个双翼飞机，
 * 主要构件:1、飞机的螺旋桨；2、飞机前端的上下两个机翼；3、飞机的机身；
 * 4、飞机后端的尾翼；5、座位及挡风玻璃；6、飞机的轮胎，前边两个以及后边的一个；
 *
 * Created by zhouhui on 2019/10/5.
 */
window.planeFactory = new Object();
(function(w){
    var plane = function(scene){
        this.scene = scene;
        this.body =new THREE.Group();
        this.init();
    };
    plane.prototype = {
        init : function(){
            var wing_front_top_mesh = new wing_front_top();
            this.body.add(wing_front_top_mesh.build());
            this.scene.add(this.body);
        }
    };
    w.plane = plane;

    var wing_front = function(){
        this.width = 14;
        this.height = 4;
        this.depth = 0.4;
    };

    var wing_front_top = function(){
        this.body = new THREE.Group();
        this.bodyShape = new THREE.Shape();
        this.bodyGeometry = null;
        this.bodyMaterial = null;
        this.mesh = null;

        this.materialColor = 0x00ff00;
        this.

        this.extrudeSettings = null;
        this.init();
    };
    wing_front_top.prototype = {
        init : function(){
            wing_front.call(this);
            this.extrudeSettings = {
                depth: this.depth,
                bevelEnabled: false,
                bevelSegments: 2,
                steps: 1,
                bevelSize: 0,
                bevelThickness: 1,
                bevelOffset: 0
            };

            this.bodyShape.moveTo(0,0);
            this.bodyShape.lineTo(this.width, 0);
            this.bodyShape.absarc( this.width, this.height / 2 , this.height / 2, -Math.PI / 2, Math.PI / 2, false );
            this.bodyShape.lineTo(0, this.height);
            this.bodyShape.absarc( 0, this.height / 2 , this.height / 2, Math.PI / 2, -Math.PI / 2, false );
            this.bodyGeometry = new THREE.ExtrudeBufferGeometry(this.bodyShape,this.extrudeSettings);
            this.bodyMaterial = new THREE.MeshBasicMaterial( {
                color: this.materialColor,
                wireframe : true,
            } );
            this.mesh = new THREE.Mesh( this.bodyGeometry, this.bodyMaterial ) ;
        },
        build : function(){
            return this.mesh;
        }
    };
    w.wing_front_top = wing_front_top;
})(planeFactory);