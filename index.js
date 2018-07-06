/*globals THREE */
(() => {
    var dom = document.querySelector('canvas'),
    width = window.innerWidth,
    height = window.innerHeight,
    mp = Math.PI,
    z = 10,
    reqRet,
    rad = function(r){return r * (Math.PI / 180);};



    (function(w,r){
        w['r'+r] = w['r'+r] ||
        w['webkitR'+r] ||
        w['mozR'+r] ||
        w['oR'+r] ||
        w['msR'+r] ||
        function(callback){w.setTimeout(callback,1000/60);};
    })(window,'equestAnimationFrame');

    (function(w,c){
        w['c'+c] = w['c'+c] ||
        w['webkitC'+c] ||
        w['mozC'+c] ||
        w['oC'+c] ||
        w['msC'+c] ||
        function(callback){w.clearTimeout(callback);};
    })(window,'ancelAnimationFrame');

    var renderer = new THREE.WebGLRenderer({
        canvas:dom
    });
    renderer.setSize(width,height);
    renderer.setPixelRatio(window.devicePixelRatio);

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(30,width / height,1,10000);
    camera.position.set(0, 0, z);

    var draw = function(){
        var mesh = new THREE.Mesh(
            new THREE.BoxGeometry(3,3,3),
            new THREE.MeshPhongMaterial({color:0xf8b500,shininess:80})
        );
        mesh.position.set(5,0,-5);
        scene.add(mesh);
    };
    draw();

    var light_1 = new THREE.DirectionalLight(0xffffff,1.4);
    var light_2 = new THREE.AmbientLight(0xffffff,0.4);
    light_1.position.set(0,100,100);
    scene.add(light_1);
    scene.add(light_2);




    var ctrl = new THREE.OrbitControls(camera,dom);
    // ctrl.autoRotate = true;
    ctrl.enableZoom = false;
    ctrl.enablePan = false;

    renderer.setClearColor(0xffffff, 1.0);

    var load = function(){
        scene.traverse(function(obj){
            if(obj instanceof THREE.Mesh === true){
                obj.rotation.x += 0.005;
                obj.rotation.y += 0.005;
                obj.rotation.z += 0.005;
            }
        });

        camera.position.y = 0;
        camera.position.z = z;


        ctrl.update();
        renderer.render(scene,camera);
        requestAnimationFrame(load);
    };

    load();

    var reset_obj ={};
    var reset = function(){
        reset_obj.id = requestAnimationFrame(reset);
        reset_obj.num_x = camera.position.x > 0?((camera.position.x | 0) - 0) / 4:(0 - (camera.position.x | 0)) / 4;
        // reset_obj.num_y = camera.position.y > 0?((camera.position.y | 0) - 0) / 4:(0 - (camera.position.y | 0)) / 4;
        // reset_obj.num_z = camera.position.z > z?((camera.position.z | 0) - z) / 4:(z - (camera.position.z | 0)) / 4;

        if((camera.position.x | 0) !== 0) camera.position.x = camera.position.x > 0?(camera.position.x | 0) - reset_obj.num_x:(camera.position.x | 0) + reset_obj.num_x;
        // if((camera.position.y | 0) !== 0) camera.position.y = camera.position.y > 0?(camera.position.y | 0) - reset_obj.num_y:(camera.position.y | 0) + reset_obj.num_y;
        // if((camera.position.z | 0) !== 0) camera.position.z = camera.position.z > 0?(camera.position.z | 0) - reset_obj.num_z:(camera.position.z | 0) + reset_obj.num_z;

        // if(camera.position.x === 0 && camera.position.y === 0 && camera.position.z === z){
        console.log(camera.position.x);
        if((camera.position.x | 0) === 0){
            camera.position.x = 0;
            cancelAnimationFrame(reset_obj.id);
        }
    };


    $(window).on('resize',function(){
        var w = window.innerWidth,
            h = window.innerHeight;
        renderer.setSize(w,h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    })
    .on('mouseup',function(){
        if(camera.position.x !== 0){
        // if(camera.position.x !== 0 || camera.position.y !== 0 || camera.position.z !== z){
            reset();
        }
    });
})();
