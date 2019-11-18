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
            this.light.position.set( 0, 20, 0 );
            this.scene.add(this.light);
        }
    };
    w.hemisphereLight = hemisphereLight;
})(lightFactory);