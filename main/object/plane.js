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

            var wing_front_bottom_mesh = new wing_front_bottom();
            this.body.add(wing_front_bottom_mesh.build());

            var plane_body_mesh = new plane_body();
            this.body.add(plane_body_mesh.build());

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
        this.body = null;
        this.bodyShape = new THREE.Shape();
        this.bodyGeometry = null;
        this.bodyMaterial = null;

        this.materialColor = 0x00ff00;
        this.distance = 4;
        this.distance_angle = Math.PI / 4;

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
            this.bodyShape.lineTo((this.width - this.distance) / 2, 0);
            this.bodyShape.absarc(
                this.width / 2,
                -1 * this.distance / 2 / Math.tan(this.distance_angle),
                this.distance / 2 / Math.sin(this.distance_angle) ,
                Math.PI / 2 + this.distance_angle,
                Math.PI / 2 - this.distance_angle,
                true
            );
            this.bodyShape.lineTo(this.width , 0);
            this.bodyShape.absarc( this.width, this.height / 2 , this.height / 2, -Math.PI / 2, Math.PI / 2, false );
            this.bodyShape.lineTo(0, this.height);
            this.bodyShape.absarc( 0, this.height / 2 , this.height / 2, Math.PI / 2, -Math.PI / 2, false );
            this.bodyGeometry = new THREE.ExtrudeBufferGeometry(this.bodyShape,this.extrudeSettings);
            this.bodyMaterial = new THREE.MeshPhysicalMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            } );
            //设置位置
            this.setSite();

            this.body = new THREE.Mesh( this.bodyGeometry, this.bodyMaterial ) ;
        },
        setSite : function(){
            this.bodyGeometry.rotateX(Math.PI / 2);
            this.bodyGeometry.rotateY(0);
            this.bodyGeometry.rotateZ(0);
            this.bodyGeometry.translate(0 ,5.2 ,0);
        },
        build : function(){
            return this.body
        }
    };
    w.wing_front_top = wing_front_top;

    var wing_front_bottom = function(){
        this.body = null;
        this.bodyShape = new THREE.Shape();
        this.bodyGeometry = null;
        this.bodyMaterial = null;

        this.materialColor = 0x00ff00;

        this.extrudeSettings = null;
        this.init();
    };
    wing_front_bottom.prototype = {
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
            this.bodyShape.lineTo(this.width , 0);
            this.bodyShape.absarc( this.width, this.height / 2 , this.height / 2, -Math.PI / 2, Math.PI / 2, false );
            this.bodyShape.lineTo(0, this.height);
            this.bodyShape.absarc( 0, this.height / 2 , this.height / 2, Math.PI / 2, -Math.PI / 2, false );
            this.bodyGeometry = new THREE.ExtrudeBufferGeometry(this.bodyShape,this.extrudeSettings);
            this.bodyMaterial = new THREE.MeshPhysicalMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            } );
            //设置位置
            this.setSite();

            this.body = new THREE.Mesh( this.bodyGeometry, this.bodyMaterial ) ;
        },
        setSite : function(){
            this.bodyGeometry.rotateX(Math.PI / 2);
            this.bodyGeometry.rotateY(0);
            this.bodyGeometry.rotateZ(0);
            this.bodyGeometry.translate(0,0,0);
        },
        build : function(){
            return this.body
        }
    };
    w.wing_front_bottom = wing_front_top;

    var plane_body = function(){
        this.body = null;

        this.radiusTop = 2.5;
        this.radiusBottom = 2.5;
        this.height = 12;
        this.radialSegments = 12;
        this.heightSegments = 10;
        this.openEnded = false;
        this.thetaStart = 0;
        this.thetaLength = 2 * Math.PI;

        this.bodyGeometry = null;

        this.bodyMaterial = null;
        this.materialColor = 0x00ff00;
        this.init();
    };
    plane_body.prototype = {
        init : function(){
            var height_center = 6,
                height_front = 1.2;
            this.bodyGeometry = new THREE.CylinderGeometry(
                this.radiusTop,
                this.radiusBottom,
                height_center,
                this.radialSegments,
                1,
                this.openEnded,
                this.thetaStart,
                this.thetaLength
            );


            var frontBodyGeometry = buildFrontBodyOfPlane(height_front);
            frontBodyGeometry.translate(0,-1 * ( height_center  + height_front ) / 2 ,0);
            this.bodyGeometry.merge(frontBodyGeometry);

            this.bodyMaterial = new THREE.MeshPhysicalMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            } );
            this.setSite();
            this.body = new THREE.Mesh( this.bodyGeometry, this.bodyMaterial ) ;
        },
        setSite : function(){
            var wing = new wing_front();
            this.bodyGeometry.rotateX(-1 * Math.PI / 2);
            this.bodyGeometry.rotateY(0);
            this.bodyGeometry.rotateZ(0);
            this.bodyGeometry.translate(wing.width / 2,this.radiusTop - wing.depth,1.5);
        },
        build : function(){
            return this.body;
        }
    };
    w.plane_body = plane_body;

    function buildFrontBodyOfPlane(height_front){
        var front_angel =  Math.PI / 3;
        var front_shape = new THREE.Shape();
        front_shape.moveTo(0 , 0);
        front_shape.lineTo(0 , height_front);
        front_shape.absarc( 0, 0 , height_front, Math.PI / 2,  Math.PI / 2 - front_angel , true );
        front_shape.lineTo(height_front * Math.cos(Math.PI / 2 - front_angel),0);
        front_shape.lineTo(0 , 0);

        var curve = new THREE.CatmullRomCurve3(
            new THREE.Vector2( -10, 0 ),
            new THREE.Vector2( -5, 15 ),
            new THREE.Vector2( 20, 15 ),
            new THREE.Vector2( 10, 0 )
        );

        var extrudeSettings = {
            bevelEnabled: false,
            steps: 6,
            extrudePath : curve
        };

        var geometry = new THREE.ExtrudeGeometry( front_shape, extrudeSettings );
        return geometry;
    }
})(planeFactory);