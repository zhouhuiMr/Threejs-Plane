/**
 * 说明：创建一个双翼飞机，
 * 主要构件:1、飞机的螺旋桨；2、飞机前端的上下两个机翼；3、飞机的机身；
 * 4、飞机后端的尾翼；5、座位及挡风玻璃；6、飞机的轮胎，前边两个以及后边的一个；
 *
 * Created by zhouhui on 2019/10/5.
 */
window.planeFactory = new Object();
(function(w){
    /**
     * 飞机的对象，用此对象进行飞机的创建
     * @since 2019.10.09
     * */
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

    /**
     * 飞机机翼的上边机翼
     * @since2019.10.09
     * */
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

    /**
     * 飞机机翼的下边机翼
     * @since2019.10.09
     * */
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

    /**
     * 飞机的主体部分
     * @since 2019.10.09
     * */
    var plane_body = function(){
        this.body = null;

        this.radiusTop = 2.5;
        this.radiusBottom = 2.5;
        this.height = 12;
        this.radialSegments = 12;
        this.heightSegments = 10;
        this.openEnded = true;
        this.thetaStart = 0;
        this.thetaLength = 2 * Math.PI;

        this.bodyGeometry = null;

        this.bodyMaterial = null;
        this.materialColor = 0x00ff00;
        this.init();
    };
    plane_body.prototype = {
        init : function(){
            var height_center = 4.5,
                height_front = this.radiusTop;
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
            //进行图形的合并
            var frontBodyGeometry = buildFrontBodyOfPlane(height_front,this.radialSegments);
            frontBodyGeometry.translate(0,height_center / 2 ,0);
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
            this.bodyGeometry.rotateX(1 * Math.PI / 2);
            this.bodyGeometry.rotateY(0);
            this.bodyGeometry.rotateZ(0);
            this.bodyGeometry.translate(wing.width / 2,this.radiusTop - wing.depth,2);
        },
        build : function(){
            return this.body;
        }
    };
    w.plane_body = plane_body;

    /**
     *飞机的本体的前端部分
     *@since 2019.10.09
     * */
    function buildFrontBodyOfPlane(height_front,radialSegments){
        var points = [];
        var changeAngleRate = Math.PI / 16,//变化的角度数
            changeAngleTimes = 3;//角度数变化的次数
        //points.push( new THREE.Vector3(0 , 0 ,0));
        points.push( new THREE.Vector3(height_front, 0, 0));
        //0°到45°
        for ( var i = 1; i <= changeAngleTimes; i ++ ) {
            var y = height_front * Math.sin(changeAngleRate * i),
                x = height_front * Math.cos(changeAngleRate * i );
            points.push( new THREE.Vector3(x , y  ,0));
        }
        points.push( new THREE.Vector3( height_front * Math.sin(   changeAngleRate *  changeAngleTimes) - 0.1,height_front * Math.sin(   changeAngleRate *  changeAngleTimes) - 0.2,0));
        points.push( new THREE.Vector3( 0,height_front * Math.sin(   changeAngleRate *  changeAngleTimes) - 0.2,0));
        points.push( new THREE.Vector3( 0 , 0 , 0));
        var geometry = new THREE.LatheGeometry( points,radialSegments,0,2 * Math.PI);
        return geometry;
    };
})(planeFactory);