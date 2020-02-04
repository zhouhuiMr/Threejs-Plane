/**
 * 光照系统设置，每种光照添加辅助工具
 *
 * @since 2019.11.18
 * @author zhouhui
 * */
window.lightFactory = new Object();
(function(w){

    let commonProperties = function(){
        this.isUseHelper = true;
    };

    /**
     * 半球光，
     * 从天空光线颜色颜色渐变到地面光线颜色。
     * @since 2019.11.18
     * */
    let hemisphereLight = function(scene){
        this.scene = scene;

        this.skyColor = 0xffffbb;
        this.groundColor = 0x080820;
        this.intensity = 1;//光照强度
        this.light = null;
        this.helper = null;
        this.helperSize = 5;//模拟光源的网格大小

        this.postionX = 0;
        this.postionY = 0;
        this.postionZ = 0;

        this.init();
    };
    hemisphereLight.prototype = {
        init : function(){
            commonProperties.call(this);
            this.light = new THREE.HemisphereLight( this.skyColor, this.groundColor, this.intensity );
            if(this.isUseHelper){
                this.helper = new THREE.HemisphereLightHelper( this.light, this.helperSize );
                this.scene.add( this.helper );
            }
            this.scene.add(this.light);
        },
        setSite : function(x,y,z){
            if(this.light != null){
                this.postionX = x;
                this.postionY = y;
                this.postionZ = z;
                this.light.position.set( x,y,z );
            }
        }
    };
    w.hemisphereLight = hemisphereLight;

    let directionLieght = function(scene){
        this.scene = scene;

        this.color = 0xffffff;
        this.intensity = 0.3;//光照强度

        this.light = null;
        this.lightHelper = null;
        this.lightHelperSize = 10;
        this.cameraHelper = null;

        this.postionX = 0;
        this.postionY = 0;
        this.postionZ = 0;

        this.init()
    };
    directionLieght.prototype = {
        init : function(){
            commonProperties.call(this);
            this.light = new THREE.DirectionalLight( this.color );
            this.light.castShadow = true;

            this.light.shadow.mapSize.width = 512;
            this.light.shadow.mapSize.height = 1024;
            this.light.shadow.camera.near = 0.1;
            this.light.shadow.camera.far = 110;
            this.light.shadow.camera.top = 70;
            this.light.shadow.camera.right = 30;
            this.light.shadow.camera.bottom = -70;
            this.light.shadow.camera.left = -30;


            if(this.isUseHelper){
                this.lightHelper = new THREE.DirectionalLightHelper( this.light, this.lightHelperSize );
                this.scene.add(this.lightHelper);
                this.cameraHelper = new THREE.CameraHelper( this.light.shadow.camera );
                this.scene.add( this.cameraHelper );
            }
            this.scene.add(this.light);
        },
        setSite : function(x,y,z){
            if(this.light != null){
                this.postionX = x;
                this.postionY = y;
                this.postionZ = z;
                this.light.position.set( x,y,z );
            }
        }
    };
    w.directionLieght = directionLieght;
})(lightFactory);