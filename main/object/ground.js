window.groundFactory = new Object();
(function(w){
    let commonProperties = function(){
        this.groundWidth = 160;
        this.groundHeight = 15;
        this.widthSegments = this.groundWidth / 4;
        this.heightSegments = this.groundHeight / 2;
        this.postionX = 0;
        this.postionY = 0;
        this.postionZ = 0;
        this.moveSpeed_X = 1;

        this.isUseWireframe = false; //是否显示线条，true显示为线条
    };

    /**
     *  创建地面信息
     *  @param scene 场景
     *
     *  @since 2020.02.01
     *  @author zhouhui
     */
    let ground = function(scene){
        this.scene = scene;

        this.groundArray = new Array();//储存所有生成的地面信息

        this.init();
    };
    ground.prototype = {
        init : function(){
            //设置草地
            let grassGround = new window.groundFactory.grassGround(helper.scene);
            grassGround.body.position.x = -grassGround.groundWidth / 2 + 30;
            let grassItem = {
                w : grassGround.groundWidth,
                h : grassGround.groundHeight,
                isShow : true,
                ground : grassGround,
                type : "grass"
            };
            this.groundArray.push(grassItem);

            //设置海洋
            let oceanGround = new window.groundFactory.ocean(helper.scene);
            oceanGround.body.position.x = grassGround.body.position.x + grassGround.groundWidth / 2;
            oceanGround.body.position.x += oceanGround.groundWidth / 2 - 1.5;
            let oceanItem = {
                w : oceanGround.groundWidth,
                h : oceanGround.groundHeight,
                isShow : true,
                ground : oceanGround,
                type : "ocean"
            };
            this.groundArray.push(oceanItem);

            let mountainGround = new window.groundFactory.mountainGround(helper.scene,3,12.2);
            mountainGround.body.position.z = grassGround.body.position.z - grassGround.groundHeight / 2;
            mountainGround.body.position.z -= mountainGround.groundHeight / 2 - 1.5;
            mountainGround.body.position.y -= 1;

            let groundItem = {
                w : mountainGround.groundWidth,
                h : mountainGround.groundHeight,
                isShow : true,
                ground : mountainGround,
                type : "mountain"
            };
            this.groundArray.push(groundItem);
        },
        runAnimate : function(){
            for(let i=0;i<this.groundArray.length;i++){
                let item = this.groundArray[i];
                let g = item.ground;
                g.runAnimate();
            }
        }
    };
    w.ground = ground;

    /**
     *  用于阴影测试使用的地面对象
     *
     *  @since 2020.01.21
     *  @author zhouhui
     */
    let shadowTestGround = function(scene){
        this.scene = scene;

        this.groundWidth = 200;
        this.groundHeight = 200;
        this.groundColor = 0x8B8386;

        this.groundGeometry = null;
        this.material = null;

        this.body = null;

        this.init();
    };
    shadowTestGround.prototype = {
        init : function(){
            commonProperties.call(this);

            this.groundGeometry = new THREE.PlaneBufferGeometry(this.groundWidth,this.groundHeight,100,100);
            this.material = new THREE.MeshStandardMaterial( {
                color: this.groundColor,
                side : THREE.FrontSide,
            } );
            this.body = new THREE.Mesh(this.groundGeometry,this.material);
            this.body.rotation.x = - Math.PI / 2;
            this.body.translateY(5);

            this.body.castShadow = false;
            this.body.receiveShadow = true;

            this.scene.add(this.body);
        }
    };
    w.shadowTestGround = shadowTestGround;

    let grassGround = function(scene){
        this.scene = scene;

        this.groundWidth = 200;
        this.groundHeight = 60;
        this.groundColor = 0x6b9852;

        this.groundGeometry = null;
        this.material = null;

        this.body = null;
        this.vertices = new Array();

        this.init();

    };
    grassGround.prototype = {
        init : function(){
            commonProperties.call(this);
            this.groundWidth = 100;

            this.groundGeometry = new THREE.PlaneBufferGeometry(this.groundWidth,this.groundHeight,
                this.widthSegments, this.heightSegments  );

            this.material = new THREE.MeshPhongMaterial( {
                color: this.groundColor,
                side : THREE.FrontSide,
                transparent: false,
                opacity : 0.9,
                flatShading:true,
                wireframe : this.isUseWireframe
            } );
            this.material.shininess = 1;


            this.body = new THREE.Mesh(this.groundGeometry,this.material);
            this.body.rotation.x = - Math.PI / 2;

            this.body.castShadow = false;
            this.body.receiveShadow = true;

            this.scene.add(this.body);
        },
        runAnimate : function(){

        },
        setSite : function(x,y,z){
            this.postionX = x;
            this.postionY = y;
            this.postionZ = z;
            this.body.translateX(this.postionX);
            this.body.translateY(this.postionY);
            this.body.translateZ(this.postionZ);
        }
    };
    w.grassGround = grassGround;

    /**
     * 海洋地形信息
     * @param  scene 场景信息
     *
     * @since 2020.01.28
     * @author zhouhui
     */
    let ocean = function(scene){
        this.scene = scene;

        this.groundWidth = 200;
        this.groundHeight = 60;
        this.groundColor = 0x00868B;

        this.groundGeometry = null;
        this.material = null;

        this.body = null;
        this.vertices = new Array();

        this.init();

    };
    ocean.prototype = {
        init : function(){
            commonProperties.call(this);
            this.groundWidth = 90;

            this.groundGeometry = new THREE.PlaneBufferGeometry(this.groundWidth,this.groundHeight,
                this.widthSegments, this.heightSegments  );

            this.material = new THREE.MeshPhongMaterial( {
                color: this.groundColor,
                side : THREE.FrontSide,
                transparent: true,
                opacity : 0.7,
                flatShading:true,
                wireframe : this.isUseWireframe
            } );
            this.material.shininess = 10;

            this.vertices = postionArrayToVector3(this.groundGeometry);

            this.body = new THREE.Mesh(this.groundGeometry,this.material);
            this.body.rotation.x = - Math.PI / 2;

            this.body.castShadow = false;
            this.body.receiveShadow = true;

            this.scene.add(this.body);
        },
        runAnimate : function(){
            let attribute = this.groundGeometry.getAttribute("position");
            let n_postionArray = new Array();
            for(let i=0;i<this.vertices.length;i++){
                let item = this.vertices[i];

                item.x += Math.sin(item.ang) * 0.01;
                n_postionArray.push(item.x);

                item.y += Math.sin(item.ang) * 0.01;
                n_postionArray.push(item.y);

                item.z += Math.cos(item.ang) * 0.01;
                n_postionArray.push(item.z);
                item.ang += item.speed;
            }
            attribute.array = new Float32Array(n_postionArray);
            attribute["needsUpdate"] = true;
        },
        setSite : function(x,y,z){
            this.postionX = x;
            this.postionY = y;
            this.postionZ = z;
            this.body.translateX(this.postionX);
            this.body.translateY(this.postionY);
            this.body.translateZ(this.postionZ);
        }
    };
    w.ocean = ocean;

    /**
     *  山体地形
     *  @param scene场景对象
     *
     *  @since 2020.01.28
     *  @author zhouhui
     */
    let mountainGround = function(scene,qualityNum,z){
        this.scene = scene;

        this.groundWidth = 200;
        this.groundHeight = 50;
        this.groundColor = 0x662907;

        this.qualityNum = qualityNum;
        this.z = z;

        this.maxDistince = 0;//一定范围内的最高距离
        this.minDistince = this.groundHeight;// 一定范围内的最小距离
        this.distinceScope = 10;//这个范围的数值

        this.groundGeometry = null;
        this.material = null;

        this.body = null;
        this.vertices = new Array();

        this.init();
    };
    mountainGround.prototype = {
        init : function(){
            commonProperties.call(this);

            this.groundHeight = 10;
            this.widthSegments = this.groundWidth / 3;
            this.heightSegments = this.groundHeight;

            let mountainGeometry = new THREE.PlaneBufferGeometry(this.groundWidth,this.groundHeight,
                this.widthSegments - 1, this.heightSegments - 1 );

            let data = generateHeight( this.widthSegments, this.heightSegments, this.qualityNum, this.z);
            let vertices = mountainGeometry.attributes.position.array;

            for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
                let x = Math.abs(vertices[j]);
                let y = Math.abs(vertices[j + 1]);

                if(x >= this.groundWidth / 2 - 0.2){
                    vertices[ j + 0] += (Math.random() * 1 - 0.5);
                    vertices[ j + 1] += (Math.random() * 4 - 2);
                    vertices[ j + 2 ] += 0;
                }else if( y >= this.groundHeight / 2 - 0.2 ){
                    vertices[ j + 0] += (Math.random() * 1 - 0.5);
                    vertices[ j + 1] += (Math.random() * 2 - 1);
                    vertices[ j + 2 ] += 0;
                }else{
                    vertices[ j + 2 ] = data[ i ] * 0.5;
                }
            }

            const geometries = [mountainGeometry];
            this.groundGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries,false);

            this.material = new THREE.MeshPhongMaterial( {
                color: this.groundColor,
                side : THREE.FrontSide,
                transparent: false,
                opacity : 0.7,
                flatShading:true,
                wireframe : this.isUseWireframe
            } );
            this.material.shininess = 0;

            this.body = new THREE.Mesh(this.groundGeometry,this.material);
            this.body.rotation.x = - Math.PI / 2;


            this.body.castShadow = true;
            this.body.receiveShadow = true;

            this.scene.add(this.body);
        },
        runAnimate : function(){

        },
        setSite : function(x,y,z){
            this.postionX = x;
            this.postionY = y;
            this.postionZ = z;
            this.body.translateX(this.postionX);
            this.body.translateY(this.postionY);
            this.body.translateZ(this.postionZ);
        }
    };
    w.mountainGround = mountainGround;

    /**
     *  将bufferGeometry顶点信息存储到对象中
     *  @param bufferGeometry 图形对象
     *  @return vertices 整理过的顶点信息
     *
     *  @since 2020.01.28
     *  @author zhouhui
     *
     */
    function postionArrayToVector3(bufferGeometry){
        const vertices = new Array();
        //设置顶点
        let postionCount = bufferGeometry.attributes.position.count;
        for(let i=0;i<postionCount;i++){
            let item = {
                x : 0,
                y : 0,
                z : 0,
                ang : Math.random() * Math.PI * 1,
                speed : 0.016 + Math.random() * 0.032
            };
            vertices.push(item);
        }

        let postionArray = bufferGeometry.attributes.position.array;
        let itemSize = bufferGeometry.attributes.position.itemSize;
        for(let i=0;i<postionArray.length;i++){
            let v = parseInt(i / itemSize);
            let r = parseInt(i % itemSize);
            if(r == 0){
                vertices[v].x = postionArray[i];
            }else if(r == 1){
                vertices[v].y = postionArray[i];
            }else if(r == 2){
                vertices[v].z = postionArray[i];
            }
        }
        return vertices;
    }


    /***
     * 使用three.js 项目中的方法，不懂其逻辑，直接使用
     * @param width
     * @param height
     * @return {Uint8Array}
     */
    function generateHeight( width, height, qualityNum, z) {

        var size = width * height, data = new Uint8Array( size ),
            perlin = new ImprovedNoise(), quality = 1, z = z;

        for ( var j = 0; j < 4; j ++ ) {

            for ( var i = 0; i < size; i ++ ) {

                var x = i % width, y = ~ ~ ( i / width );
                data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
            }
            quality *= qualityNum;
        }
        return data;
    }

})(groundFactory);