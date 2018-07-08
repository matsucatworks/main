/*globals THREE */
(() => {
    var dom = document.querySelector('canvas'),
    width = window.innerWidth,
    height = window.innerHeight,
    mp = Math.PI,
    y = 1,
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
    camera.position.set(0, y, z);

    var draw_meta = {};
        var draw = function(){
        var mesh = new THREE.Mesh(
            new THREE.BoxGeometry(3,3,3,10,10),
            new THREE.MeshPhongMaterial({color:0xf8b500,shininess:80})
        );
        draw_meta.one = {};
        draw_meta.one.rotation = 0.005;
        mesh.name = 'one';
        mesh.position.set(5,0,-5);
        scene.add(mesh);
    };

    var draw2 = function(){
        var mesh = new THREE.Mesh(
            new THREE.BoxGeometry(3,3,3),
            new THREE.MeshPhongMaterial({color:0xf8b500,shininess:80})
        );
        draw_meta.two = {};
        draw_meta.two.rotation = 0.008;
        mesh.rotation.x += 0.1;
        mesh.rotation.y += 0.05;
        mesh.rotation.z += 0.5;
        mesh.name = 'two';
        mesh.position.set(0,0,0);
        scene.add(mesh);
    };
    draw();
    draw2();

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
                obj.rotation.x += draw_meta[obj.name].rotation;
                obj.rotation.y += draw_meta[obj.name].rotation;
                obj.rotation.z += draw_meta[obj.name].rotation;
            }
        });

        // camera.position.y = 0;
        // camera.position.z = z;


        ctrl.update();
        renderer.render(scene,camera);
        requestAnimationFrame(load);
    };

    load();

    var reset_obj ={};
    var reset = function(){
        reset_obj.id = requestAnimationFrame(reset);
        reset_obj.num_x = camera.position.x > 0?(camera.position.x - 0) / 18:(0 - camera.position.x) / 18;
        reset_obj.num_y = camera.position.y > y?(camera.position.y - y) / 18:(y - camera.position.y) / 18;
        reset_obj.num_z = camera.position.z > z?(camera.position.z - z) / 18:(z - camera.position.z) / 18;

        if(camera.position.x !== 0) camera.position.x = camera.position.x > 0?camera.position.x - reset_obj.num_x:camera.position.x + reset_obj.num_x;
        if(camera.position.y !== y) camera.position.y = camera.position.y > y?camera.position.y - reset_obj.num_y:camera.position.y + reset_obj.num_y;
        if(camera.position.z !== z) camera.position.z = camera.position.z > z?camera.position.z - reset_obj.num_z:camera.position.z + reset_obj.num_z;

        camera.position.x = Math.ceil(camera.position.x * 1000) / 1000;
        camera.position.y = Math.ceil(camera.position.y * 1000) / 1000;
        camera.position.z = Math.ceil(camera.position.z * 1000) / 1000;

        if((camera.position.x | 0) === 0 && (camera.position.y | 0) === y && (camera.position.z | 0) === z){
            // if((camera.position.x | 0) === 0){
            camera.position.x = 0;
            camera.position.y = y;
            camera.position.z = z;
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
    .on('mousedown',function(){
        cancelAnimationFrame(reset_obj.id);
    })
    .on('mouseup',function(){
        if(camera.position.x !== 0 || camera.position.y !== y || camera.position.z !== z){
            cancelAnimationFrame(reset_obj.id);
            reset();
        }
    });
})();
