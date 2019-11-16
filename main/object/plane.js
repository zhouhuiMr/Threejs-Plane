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
    let plane = function(scene){
        this.scene = scene;
        this.body =new THREE.Group();

        this.wing_front_mesh = new wing_front();//飞机的机翼
        this.wing_upholder_mesh = null;//飞机机翼的支撑物
        this.plane_body_mesh = new plane_body();//飞机的机身
        this.body_site_mesh = new body_site();//飞机的座位
        this.wing_back_mesh = new wing_back();//飞机的后端尾翼
        this.empennage_mesh = new empennage();//飞机的垂直尾翼
        this.propeller_mesh = new propeller();// 飞机的螺旋桨
        this.propellerUpholder_mesh = new propellerUpholder();// 飞机的螺旋桨的支撑物
        this.front_wheel_mesh = new front_wheel();// 飞机的轮胎

        this.init();
    };
    plane.prototype = {
        init : function(){
            this.body.add(this.wing_front_mesh.build());

            this.wing_upholder_mesh = new wing_upholder(
                this.wing_front_mesh.width,
                this.wing_front_mesh.height,
                this.wing_front_mesh.heightDifference
            );
            this.body.add(this.wing_upholder_mesh.build());

            this.body.add(this.plane_body_mesh.build());

            this.body.add(this.body_site_mesh.build());

            this.body.add(this.wing_back_mesh.build());

            this.body.add(this.empennage_mesh.build());

            this.body.add(this.propeller_mesh.build());

            this.body.add(this.propellerUpholder_mesh.build());

            this.body.add(this.front_wheel_mesh.build());

            this.scene.add(this.body);
        },
        runAnimate : function(){
            this.propeller_mesh.body.rotateZ(0.8);
        }
    };
    w.plane = plane;

    let wing_front = function(){
        this.width = 14;
        this.height = 4;
        this.depth = 0.4;
        this.heightDifference = 6;//两个机翼之间的高度差

        this.body = null;
        this.bodyTopShape = new THREE.Shape();
        this.bodyBottomShape = new THREE.Shape();

        this.bodyTopGeometry = null;
        this.bodyBottomGeometry = null;
        this.bodyGeometry = null;

        this.bodyMaterial = null;

        this.materialColor = 0x00ff00;
        this.distance = 4;
        this.distance_angle = Math.PI / 3;

        this.extrudeSettings = null;

        this.init();

    };
    wing_front.prototype = {
        init : function(){
            //挤出的设置
            this.extrudeSettings = {
                depth: this.depth,
                bevelEnabled: false,
                bevelSegments: 2,
                steps: 1,
                bevelSize: 0,
                bevelThickness: 1,
                bevelOffset: 0
            };
            //材质
            this.bodyMaterial = new THREE.MeshPhysicalMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            } );
            //前端的上部机翼
            this.bodyTopShape.moveTo(-this.width / 2 , -this.height / 2);
            this.bodyTopShape.lineTo((-this.width + this.distance) / 2, -this.height / 2);
            this.bodyTopShape.absarc(
                0,
                -this.height / 2 - 1 * this.distance / 2 / Math.tan(this.distance_angle),
                this.distance / 2 / Math.sin(this.distance_angle) ,
                Math.PI / 2 + this.distance_angle,
                Math.PI / 2 - this.distance_angle,
                true
            );
            this.bodyTopShape.lineTo(this.width / 2 , -this.height / 2);
            this.bodyTopShape.absarc( this.width / 2, 0 , this.height / 2, -Math.PI / 2, Math.PI / 2, false );
            this.bodyTopShape.lineTo(-this.width / 2, this.height /2);
            this.bodyTopShape.absarc( -this.width / 2, 0 , this.height / 2, Math.PI / 2, -Math.PI / 2, false );
            this.bodyTopGeometry = new THREE.ExtrudeBufferGeometry(this.bodyTopShape,this.extrudeSettings);

            this.bodyBottomShape.moveTo(-this.width / 2 , -this.height / 2);
            this.bodyBottomShape.lineTo(this.width / 2 , -this.height / 2);
            this.bodyBottomShape.absarc( this.width / 2, 0 , this.height / 2, -Math.PI / 2, Math.PI / 2, false );
            this.bodyBottomShape.lineTo(-this.width / 2 , this.height / 2);
            this.bodyBottomShape.absarc( -this.width / 2, 0 , this.height / 2, Math.PI / 2, -Math.PI / 2, false );
            this.bodyBottomGeometry = new THREE.ExtrudeBufferGeometry(this.bodyBottomShape,this.extrudeSettings);

            this.setSite();

            const geometries = [this.bodyTopGeometry,this.bodyBottomGeometry];
            this.bodyGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries,false);

            this.body = new THREE.Mesh( this.bodyGeometry, this.bodyMaterial );
        },
        setSite : function(){
            //设置一下顶部机翼的位置
            this.bodyTopGeometry.rotateX(Math.PI / 2);
            this.bodyTopGeometry.rotateY(0);
            this.bodyTopGeometry.rotateZ(0);
            this.bodyTopGeometry.translate(0 ,this.heightDifference ,0);
            //设置一下低部机翼的位置
            this.bodyBottomGeometry.rotateX(Math.PI / 2);
            this.bodyBottomGeometry.rotateY(0);
            this.bodyBottomGeometry.rotateZ(0);
            this.bodyBottomGeometry.translate(0,0,0);
        },
        build : function(){
            return this.body;
        }
    };
    w.wing_front = wing_front;

    /**
     * 飞机机翼的支撑物
     * @since 2019.10.19
     * */
    let wing_upholder = function(wing_width,wing_depth,wing_heightDifference){
        this.body = null;
        this.bodyGeometry = null;
        this.bodyMaterial = null;

        this.materialColor = 0x00ff00;

        this.wing_width = wing_width;
        this.wing_depth = wing_depth;

        this.height = wing_heightDifference;
        this.radiusTop = 0.05;
        this.radiusBottom = 0.05;
        this.radialSegments = 4;
        this.thetaStart = 0;
        this.thetaLength = Math.PI * 2;

        this.init();
    };
    wing_upholder.prototype = {
        init : function(){
            const geometry_1 = new THREE.CylinderBufferGeometry(
                this.radiusTop,
                this.radiusBottom,
                this.height,
                this.radialSegments,
                1,
                false,
                this.thetaStart,
                this.thetaLength
            );
            const geometry_2 = geometry_1.clone();
            const geometry_3 = geometry_1.clone();
            const geometry_4 = geometry_1.clone();

            geometry_1.translate(-this.wing_width / 2 , this.height / 2 - 0.1, -this.wing_depth / 2 + 0.5);
            geometry_2.translate(this.wing_width / 2, this.height / 2 - 0.1, this.wing_depth / 2 - 0.5);
            geometry_3.translate(-this.wing_width / 2 , this.height / 2 - 0.1, this.wing_depth / 2 - 0.5);
            geometry_4.translate(this.wing_width / 2, this.height / 2 - 0.1, -this.wing_depth / 2 +0.5);

            const angle = Math.PI / 3;
            let upholderExtent = this.height / Math.sin(angle);

            const geometry_5 = new THREE.CylinderBufferGeometry(
                this.radiusTop,
                this.radiusBottom,
                upholderExtent,
                this.radialSegments,
                1,
                false,
                this.thetaStart,
                this.thetaLength
            );
            const geometry_6 = geometry_5.clone();
            const geometry_7 = geometry_5.clone();
            const geometry_8 = geometry_5.clone();

            geometry_5.rotateZ(Math.PI / 2 - angle);
            geometry_5.translate(
                -this.wing_width / 2 + upholderExtent * Math.sin(angle) / 2,
                this.height / 2,
                -this.wing_depth / 2 + 0.5
            );
            geometry_6.rotateZ(Math.PI / 2 - angle);
            geometry_6.translate(
                -this.wing_width / 2 + upholderExtent * Math.sin(angle) / 2,
                this.height / 2,
                this.wing_depth / 2 - 0.5
            );
            geometry_7.rotateZ(-1 * (Math.PI / 2 - angle));
            geometry_7.translate(
                this.wing_width / 2 - upholderExtent * Math.sin(angle) / 2,
                this.height / 2,
                -this.wing_depth / 2 + 0.5
            );
            geometry_8.rotateZ(-1 * (Math.PI / 2 - angle));
            geometry_8.translate(
                this.wing_width / 2 - upholderExtent * Math.sin(angle) / 2,
                this.height / 2,
                this.wing_depth / 2 -0.5
            );

            let shortUpholderExtent = (this.height - 4) / Math.sin(angle);

            const shortGeometry_1 = new THREE.CylinderBufferGeometry(
                this.radiusTop,
                this.radiusBottom,
                shortUpholderExtent,
                this.radialSegments,
                1,
                false,
                this.thetaStart,
                this.thetaLength
            );
            const shortGeometry_3 = shortGeometry_1.clone();
            shortGeometry_1.rotateZ(Math.PI / 2 - angle);
            shortGeometry_1.translate(-this.wing_width / 2 + 4.8, 4.8, -this.wing_depth / 2 + 2.5);
            shortGeometry_3.rotateZ(-1 * (Math.PI / 2 - angle));
            shortGeometry_3.translate(this.wing_width / 2 - 4.8, 4.8, -this.wing_depth / 2 + 2.5);


            const geometries = [
                geometry_1,geometry_2,geometry_3,geometry_4,
                geometry_5,geometry_6,geometry_7,geometry_8,
                shortGeometry_1,shortGeometry_3
            ];
            this.bodyGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries,false);

            this.bodyMaterial = new THREE.MeshPhysicalMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            });
            this.body = new THREE.Mesh( this.bodyGeometry, this.bodyMaterial ) ;
        },
        build : function(){
            return this.body;
        }
    };
    w.wing_upholder = wing_upholder;

    /**
     * 飞机的主体部分
     * @since 2019.10.09
     * */
    let plane_body = function(){
        this.body = null;

        this.radiusTop = 2.5;
        this.radiusBottom = 2.5;
        this.height = 12;
        this.radialSegments = 8;
        this.heightSegments = 10;
        this.thetaStart = 0;
        this.thetaLength = 2 * Math.PI;

        this.bodyGeometry = null;

        this.bodyMaterial = null;
        this.materialColor = 0x00ff00;
        this.init();
    };
    plane_body.prototype = {
        init : function(){
            const height_center = 2,
                height_front = this.radiusTop,
                height_back = 9;
            //飞机身体的中间部分
            const centerBofyOfPlane = new THREE.CylinderBufferGeometry(
                this.radiusTop,
                this.radiusBottom,
                height_center,
                this.radialSegments,
                1,
                true,
                this.thetaStart,
                this.thetaLength
            );
            //飞机身体的前边部分
            const frontBodyGeometry = buildFrontBodyOfPlane(height_front,this.radialSegments);
            frontBodyGeometry.translate(0,height_center / 2 ,0);

            //飞机身体的后边部分
            const backBodyOfPlane = buildBackBodyOfPlane(height_back,this.radiusTop,this.radialSegments);
            backBodyOfPlane.translate(0, -1 * (height_back + height_center ) / 2 - 2,0);

            //图形合并
            const geometries = [frontBodyGeometry,centerBofyOfPlane,backBodyOfPlane];
            //var geometries = [siteBodyGeometry];
            this.bodyGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries,false);

            this.bodyMaterial = new THREE.MeshPhysicalMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            } );
            this.setSite();
            this.body = new THREE.Mesh( this.bodyGeometry, this.bodyMaterial ) ;
        },
        setSite : function(){
            const wing = new wing_front();
            this.bodyGeometry.rotateX(1 * Math.PI / 2);
            this.bodyGeometry.rotateY(0);
            this.bodyGeometry.rotateZ(0);
            this.bodyGeometry.translate(0,this.radiusTop - wing.depth,0.8);
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
        const points = [];
        const changeAngleRate = Math.PI / 16,//变化的角度数
               changeAngleTimes = 3;//角度数变化的次数
        //points.push( new THREE.Vector3(0 , 0 ,0));
        points.push( new THREE.Vector3(height_front, 0, 0));
        //0°到45°
        for ( let i = 1; i <= changeAngleTimes; i ++ ) {
            let y = height_front * Math.sin(changeAngleRate * i),
                x = height_front * Math.cos(changeAngleRate * i );
            points.push( new THREE.Vector3(x , y  ,0));
        }
        points.push( new THREE.Vector3( height_front * Math.sin(   changeAngleRate *  changeAngleTimes) - 0.1,height_front * Math.sin(   changeAngleRate *  changeAngleTimes) - 0.2,0));
        points.push( new THREE.Vector3( 0,height_front * Math.sin(   changeAngleRate *  changeAngleTimes) - 0.2,0));
        points.push( new THREE.Vector3( 0 , 0 , 0));
        const geometry = new THREE.LatheBufferGeometry( points,radialSegments,0,2 * Math.PI);
        return geometry;
    }

    /**
     *飞机的本体的后端部分
     *@since 2019.10.13
     * */
    function buildBackBodyOfPlane(height_back,radiusTop,radialSegments){
        const heightSegments = 1,//高度的分段数
               radiusBottom = 0.2;//底部圆的半径
        let moveDistince = (radiusTop - radiusBottom) / 2,
               max_y = height_back / 2 - 0.01;
        const backBodyOfPlane = new THREE.CylinderBufferGeometry(
            radiusTop,
            radiusBottom,
            height_back,
            radialSegments,
            heightSegments,
            false,
            0,
            Math.PI * 2
        );
        const vertex = new THREE.Vector3();
        const backBodyOfPlane_Position = backBodyOfPlane.attributes.position;
        const positionArray = new Array();
        for(i = 0;i<backBodyOfPlane_Position.count;i++){
            vertex.fromBufferAttribute( backBodyOfPlane_Position, i );
            if(vertex.y < 0){
                vertex.z -= radiusTop / 2 - 0.4;
            }
            positionArray.push(vertex.x);
            positionArray.push(vertex.y);
            positionArray.push(vertex.z);
        }
        backBodyOfPlane.attributes.position.array = new Float32Array(positionArray);
        return backBodyOfPlane;
    }

    /**
     * 后端的尾翼
     * @since 2019.10.20
     * */
    let wing_back = function(){
        this.body = null;
        this.bodyGeometry = null;

        this.singleWingRadius = 1.5;
        this.bodyShape = new THREE.Shape();

        this.bodyMaterial = null;
        this.extrudeSettings = null;

        this.materialColor = 0x00ff00;

        this.init();
    };
    wing_back.prototype = {
        init : function(){
            //挤出的设置
            this.extrudeSettings = {
                depth: 0.2,
                bevelEnabled: false,
                bevelSegments: 2,
                steps: 1,
                bevelSize: 0,
                bevelThickness: 1,
                bevelOffset: 0
            };
            //材质
            this.bodyMaterial = new THREE.MeshPhysicalMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            } );

            this.bodyShape.moveTo(0,0);
            this.bodyShape.absarc(
                -1 * this.singleWingRadius,
                0,
                this.singleWingRadius,
                Math.PI,
                0,
                true
            );
            this.bodyShape.absarc(
                this.singleWingRadius,
                0,
                this.singleWingRadius,
                Math.PI,
                0,
                true
            );
            this.bodyShape.bezierCurveTo(
                this.singleWingRadius * 2 , -0.1,
                this.singleWingRadius * 2 - 0.1 , -0.2,
                this.singleWingRadius * 2 - 0.2 , -0.3
            );
            this.bodyShape.lineTo( -1 * this.singleWingRadius * 2 + 0.2,-0.3);
            this.bodyShape.bezierCurveTo(
                -1 * this.singleWingRadius * 2 + 0.2 , -0.3,
                -1 * this.singleWingRadius * 2 + 0.1 , -0.2,
                -1 * this.singleWingRadius * 2 , -0.1,
            );
            this.bodyGeometry = new THREE.ExtrudeBufferGeometry( this.bodyShape, this.extrudeSettings );

            this.setSite();

            this.body = new THREE.Mesh(this.bodyGeometry , this.bodyMaterial);
        },
        setSite : function(){
            this.bodyGeometry.rotateX(-1 * Math.PI / 2);
            this.bodyGeometry.rotateY(0);
            this.bodyGeometry.rotateZ(0);
            const wing_front_object = new wing_front();
            this.bodyGeometry.translate(
                0,
                2.9,
                -10.5
            );
        },
        build : function(){
            return this.body;
        }
    };
    w.wing_back = wing_back;

    /**
     * 后端的垂直尾翼
     * @since 2019.10.27
     * */
    let empennage = function(){
        this.body = null;
        this.bodyGeometry = null;

        this.maxWidth = 3.7;
        this.maxHeight = 3;
        this.singleWingRadius = 1.5;
        this.bodyShape = new THREE.Shape();

        this.bodyMaterial = null;
        this.extrudeSettings = null;

        this.materialColor = 0x00ff00;

        this.init();
    };
    empennage.prototype = {
        init : function(){
            //挤出的设置
            this.extrudeSettings = {
                depth: 0.2,
                bevelEnabled: false,
                bevelSegments: 2,
                steps: 1,
                bevelSize: 0,
                bevelThickness: 1,
                bevelOffset: 0
            };
            //材质
            this.bodyMaterial = new THREE.MeshPhysicalMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            } );
            this.bodyShape.moveTo(0,0);
            this.bodyShape.lineTo(this.maxWidth - 0.7,this.maxHeight - 0.5);
            this.bodyShape.bezierCurveTo(
                this.maxWidth - 0.7 , this.maxHeight - 0.5,
                this.maxWidth - 0.2 , this.maxHeight,
                this.maxWidth , this.maxHeight - 1
            );
            this.bodyShape.lineTo(this.maxWidth - 0.3,0);
            this.bodyShape.lineTo(0,0);
            this.bodyGeometry = new THREE.ExtrudeBufferGeometry( this.bodyShape, this.extrudeSettings );
            this.setSite();
            this.body = new THREE.Mesh(this.bodyGeometry , this.bodyMaterial);
        },
        setSite : function(){
            this.bodyGeometry.rotateX(0);
            this.bodyGeometry.rotateY(Math.PI / 2);
            this.bodyGeometry.rotateZ(0);
            const wing_front_object = new wing_front();
            this.bodyGeometry.translate(
                0,
                2.9,
                -7.8
            );
        },
        build : function(){
            return this.body;
        }
    };
    w.empennage = empennage;

    /**
     * 飞机的螺旋桨
     * @since 2019.11.03
     * */
    let propeller = function(){
        this.body = null;
        this.bodyGeometry = null;
        this.cp1x = 0.4;
        this.cp1y = 4;
        this.cp2x = 0.6;
        this.cp2y = 4.5;
        this.x = 0;
        this.y = 4.5;

        this.bodyShape = new THREE.Shape();

        this.bodyMaterial = null;
        this.extrudeSettings = null;

        this.materialColor = 0x00ff00;

        this.init();
    };
    propeller.prototype = {
        init : function(){
            //挤出的设置
            this.extrudeSettings = {
                depth: 0.05,
                bevelEnabled: false,
                bevelSegments: 2,
                steps: 1,
                bevelSize: 0,
                bevelThickness: 1,
                bevelOffset: 0
            };
            //材质
            this.bodyMaterial = new THREE.MeshPhysicalMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            } );
            this.bodyShape.moveTo(0,0);
            this.bodyShape.bezierCurveTo(
                this.cp1x,this.cp1y,
                this.cp2x,this.cp2y,
                this.x,this.y
            );
            this.bodyShape.bezierCurveTo(
                -1 * this.cp2x , this.cp2y,
                -1 * this.cp1x , this.cp1y,
                0 , 0
            );
            const bodyGeometry_1 = new THREE.ExtrudeBufferGeometry( this.bodyShape, this.extrudeSettings );
            const bodyGeometry_2 =  bodyGeometry_1.clone ();
            bodyGeometry_2.rotateZ(-1 * 2 * Math.PI / 3);
            const bodyGeometry_3 =  bodyGeometry_1.clone ();
            bodyGeometry_3.rotateZ(1 * 2 * Math.PI / 3);
            const geometries = [bodyGeometry_1,bodyGeometry_2,bodyGeometry_3];
            this.bodyGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries,false);
            this.setSite();
            this.body = new THREE.Mesh(this.bodyGeometry , this.bodyMaterial);

            const plane_body_object = new plane_body();
            this.body.translateY(plane_body_object.radiusTop - 0.3);
            this.body.translateZ(plane_body_object.height / 2 - 2.5);
        },
        setSite : function(){
            //const plane_body_object = new plane_body();
            // this.bodyGeometry.translate(
            //     0,
            //     plane_body_object.radiusTop - 0.3,
            //     plane_body_object.height / 2 - 2.5
            // );
        },
        build : function(){
            return this.body;
        }
    };
    w.propeller = propeller;


    let propellerUpholder = function(){
        this.body = null;
        this.bodyGeometry = null;

        this.bodyMaterial = null;

        this.materialColor = 0x00ff00;

        this.points = [];

        this.init();
    };
    propellerUpholder.prototype = {
        init : function(){
            //材质
            this.bodyMaterial = new THREE.MeshPhysicalMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            } );

            this.points.push( new THREE.Vector3(0, 0.4, 0));
            //0°到45°
            for ( let i = 2; i < 6; i ++ ) {
                let y = i * 0.3,
                    x = Math.sin( i * 0.2 );
                this.points.push( new THREE.Vector3(x , y  ,0));
            }
            this.bodyGeometry = new THREE.LatheBufferGeometry( this.points,8,0,2 * Math.PI);
            this.setSite();
            this.body = new THREE.Mesh(this.bodyGeometry , this.bodyMaterial);
        },
        setSite : function(){
            this.bodyGeometry.rotateX(-1 * Math.PI / 2);
            this.bodyGeometry.rotateY(0);
            this.bodyGeometry.rotateZ(0);
            const wing_front_object = new wing_front();
            const plane_body_object = new plane_body();
            this.bodyGeometry.translate(
                0,
                plane_body_object.radiusTop - 0.3,
                plane_body_object.height / 2 - 1.7
            );
        },
        build : function(){
            return this.body;
        }
    };
    w.propellerUpholder = propellerUpholder;

    /**
     * 创建飞机的座位
     * @param radius 半径
     * @param segments 边数
     * @param depth 挤出大小
     * @since 2019.11.05
     * */
    let body_site = function(){
        this.body = null;
        this.bodyGeometry = null;

        this.depth = 2;
        this.radius = 2.5;
        this.segments = 8;
        this.fixAngle = 1 * Math.PI / 6;//座位的其实角度

        this.bodyShape = new THREE.Shape();
        this.bodyMaterial = null;
        this.extrudeSettings = null;
        this.materialColor = 0x00ff00;

        this.init();
    };
    body_site.prototype = {
        init : function(){
            this.extrudeSettings = {
                depth: this.depth,
                bevelEnabled: false,
                bevelSegments: 2,
                steps: 1,
                bevelSize: 0,
                bevelThickness: 1,
                bevelOffset: 0
            };

            //材质
            this.bodyMaterial = new THREE.MeshPhysicalMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            } );

            const siteX_1 = this.radius * Math.cos(this.fixAngle) - 0.2,
                siteY_1 = this.radius * Math.sin(this.fixAngle),
                siteX_2 = -1 * siteX_1,
                siteY_2 = siteY_1;
            const minAngle = this.fixAngle,
                   maxAngle = Math.PI - this.fixAngle;

            const angel = Math.PI * 2 / this.segments;
            for(let i = 0; i <= this.segments; i++){
                let x = Math.cos(angel * i) * this.radius,
                    y = Math.sin(angel * i) * this.radius;
                if(y >= siteY_1){
                    this.bodyShape.lineTo(siteX_1,siteY_1);
                    this.bodyShape.lineTo(siteX_2,siteY_2);
                    continue
                }
                this.bodyShape.lineTo(x,y);
            }
            this.bodyGeometry = new THREE.ExtrudeBufferGeometry( this.bodyShape, this.extrudeSettings );
            this.setSite();
            this.body = new THREE.Mesh(this.bodyGeometry , this.bodyMaterial);
        },
        setSite : function(){
            const wing_front_object = new wing_front();
            const plane_body_object = new plane_body();
            this.bodyGeometry.translate(
                0,
                plane_body_object.radiusTop - 0.4,
                - 2.2
            );
        },
        build : function(){
            return this.body;
        }
    };
    w.body_site = body_site;

    /**
     * 飞机前边的轮子
     * @since 2019.11.08
     * */
    let front_wheel = function(){
        this.body = new THREE.Group();
        this.body_1 = null;
        this.bodyGeometry_1 = null;//其中一个轮子
        this.body_2 = null;
        this.bodyGeometry_2 = null;//另一个轮子
        this.body_3 = null;
        this.bodyGeometry_3 = null;//后方的一个轮子

        this.body_upholder_1 = null;
        this.body_upholder_2 = null;
        this.body_upholder_3 = null;//后方的支撑物
        this.bodyGeometry_upholder_1 = null;
        this.bodyGeometry_upholder_2 = null;
        this.bodyGeometry_upholder_3 = null;
        this.upholderInterval = 5;

        this.radius = 0.5;
        this.depth = 0.1;
        this.radius_hind = 0.1;

        this.upholder_Height = 1.2;
        this.upholder_Weight = 0.1;
        this.upholder_Angle = Math.PI / 3;//轮胎支撑物的角度
        this.upholder_Height_hind = 0.5;
        this.upholder_Weight_hind = 0.5;

        this.bodyShape_wheel = new THREE.Shape();//轮子的形状
        this.bodyShape_wheel_upholder = new THREE.Shape();//轮子的支撑物形状
        this.bodyShape_wheel_hind = new THREE.Shape();//后端轮子的形状
        this.bodyShape_wheel_upholder_hind = new THREE.Shape();//后端轮子的支撑物形状

        this.bodyMaterial = null;
        this.extrudeSettings_wheel = null;
        this.extrudeSettings_upholder = null;
        this.materialColor = 0x00ff00;

        this.init();
    };
    front_wheel.prototype = {
        init : function(){
            this.extrudeSettings_wheel = {
                depth: this.depth,
                bevelEnabled: true,
                bevelSegments: 1,
                steps: 1,
                bevelSize: 0.1,
                bevelThickness: 0.2,
                bevelOffset: 0.3
            };
            this.extrudeSettings_upholder = {
                depth: this.depth,
                bevelEnabled: true,
                bevelSegments: 1,
                steps: 1,
                bevelSize: 0.1,
                bevelThickness: 0.1,
                bevelOffset: 0.1
            };

            //材质
            this.bodyMaterial_wheel = new THREE.MeshLambertMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            } );
            this.bodyMaterial_upholder = new THREE.MeshPhysicalMaterial( {
                color: this.materialColor,
                side : THREE.FrontSide,
                wireframe : true,
            } );

            this.bodyShape_wheel.absarc(0,0,this.radius,0,6.4,true);
            this.bodyGeometry_1 = new THREE.ExtrudeBufferGeometry(
                this.bodyShape_wheel,
                this.extrudeSettings_wheel
            );
            this.bodyGeometry_2 = this.bodyGeometry_1.clone();

            //后端轮胎
            this.bodyShape_wheel_hind.absarc(0,0,this.radius_hind,0,6.4,true);
            this.bodyGeometry_3 = new THREE.ExtrudeBufferGeometry(
                this.bodyShape_wheel_hind,
                this.extrudeSettings_wheel
            );

            //支撑物的形状
            this.bodyShape_wheel_upholder.moveTo(0,this.upholder_Height / 2);
            this.bodyShape_wheel_upholder.lineTo(-this.upholder_Weight , this.upholder_Height / 2);
            this.bodyShape_wheel_upholder.lineTo(-this.upholder_Weight, -this.upholder_Height / 2);
            this.bodyShape_wheel_upholder.lineTo(0, -this.upholder_Height / 2);
            let move_width = this.upholder_Height / 2 * Math.tan(this.upholder_Angle);
            this.bodyShape_wheel_upholder.lineTo(move_width , this.upholder_Height / 2);
            this.bodyShape_wheel_upholder.lineTo(move_width - this.upholder_Weight, this.upholder_Height / 2);
            let move_height = this.upholder_Weight / Math.tan(this.upholder_Angle);
            this.bodyShape_wheel_upholder.lineTo(0, move_height - this.upholder_Height / 2);
            this.bodyShape_wheel_upholder.lineTo(0, this.upholder_Height / 2);

            this.bodyGeometry_upholder_1 = new THREE.ExtrudeBufferGeometry(
                this.bodyShape_wheel_upholder,
                this.extrudeSettings_upholder
            );
            this.bodyGeometry_upholder_2 = this.bodyGeometry_upholder_1.clone();

            //后方轮胎支撑物
            let dis = 0.2;
            this.bodyShape_wheel_upholder_hind.moveTo(
                -this.upholder_Weight_hind / 2,
                this.upholder_Height_hind / 2
            );
            this.bodyShape_wheel_upholder_hind.lineTo(
                -this.upholder_Weight_hind / 2 + dis,
                -this.upholder_Height_hind / 2
            );
            this.bodyShape_wheel_upholder_hind.lineTo(
                this.upholder_Weight_hind / 2 - dis,
                -this.upholder_Height_hind / 2
            );
            this.bodyShape_wheel_upholder_hind.lineTo(
                this.upholder_Weight_hind / 2,
                this.upholder_Height_hind / 2
            );
            this.bodyGeometry_upholder_3 = new THREE.ExtrudeBufferGeometry(
                this.bodyShape_wheel_upholder_hind,
                this.extrudeSettings_upholder
            );

            this.setSite();
            this.body_1 = new THREE.Mesh(this.bodyGeometry_1 , this.bodyMaterial_wheel);
            this.body_2 = new THREE.Mesh(this.bodyGeometry_2 , this.bodyMaterial_wheel);
            this.body_3 = new THREE.Mesh(this.bodyGeometry_3 , this.bodyMaterial_wheel);
            this.body_upholder_1 = new THREE.Mesh(this.bodyGeometry_upholder_1 , this.bodyMaterial_upholder);
            this.body_upholder_2 = new THREE.Mesh(this.bodyGeometry_upholder_2 , this.bodyMaterial_upholder);
            this.body_upholder_3 = new THREE.Mesh(this.bodyGeometry_upholder_3 , this.bodyMaterial_upholder);
            this.body.add(this.body_1);
            this.body.add(this.body_2);
            this.body.add(this.body_3);
            this.body.add(this.body_upholder_1);
            this.body.add(this.body_upholder_2);
            this.body.add(this.body_upholder_3);
        },
        setSite : function(){
            const rotate_z = Math.PI / 6;
            this.bodyGeometry_1.rotateY(Math.PI / 2);
            this.bodyGeometry_2.rotateY(Math.PI / 2);
            this.bodyGeometry_3.rotateY(Math.PI / 2);
            this.bodyGeometry_1.translate(0.4,-this.upholder_Height - this.radius / 2, -0.1);
            this.bodyGeometry_2.translate(-0.6,-this.upholder_Height - this.radius / 2 - 0.2, -0.1);
            this.bodyGeometry_upholder_1.rotateY(-Math.PI / 2);
            this.bodyGeometry_upholder_1.rotateZ(rotate_z);
            this.bodyGeometry_upholder_1.translate(0,-this.upholder_Height / 2 - 0.2,0);
            this.bodyGeometry_upholder_2.rotateY(-Math.PI / 2);
            this.bodyGeometry_upholder_2.rotateZ(-rotate_z);
            this.bodyGeometry_upholder_2.translate(0,-this.upholder_Height / 2 - 0.2,0);
            this.bodyGeometry_upholder_3.rotateY(-Math.PI / 2);
            this.bodyGeometry_upholder_3.rotateX(Math.PI / 6);
            this.bodyGeometry_upholder_3.translate(-0.4,(this.upholder_Height_hind + this.radius_hind) / 2 - 0.1,0.1);

            //设置轮胎的位置
            const move_z = 0.5;
            this.bodyGeometry_1.translate(this.upholderInterval / 2, 0, move_z);
            this.bodyGeometry_upholder_1.translate(this.upholderInterval / 2, 0, move_z);
            this.bodyGeometry_2.translate(-this.upholderInterval / 2, 0, move_z);
            this.bodyGeometry_upholder_2.translate(-this.upholderInterval / 2, 0, move_z);
            const move_hind_z = -11;
            const move_hind_y = 2;
            this.bodyGeometry_3.translate(0,move_hind_y,move_hind_z);
            this.bodyGeometry_upholder_3.translate(0,move_hind_y+0.2,move_hind_z);
        },
        build : function(){
            return this.body
        }
    };
    w.front_wheel = front_wheel;
})(planeFactory);