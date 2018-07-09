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

    var camera = new THREE.PerspectiveCamera(60,width / height,1,10000);
    camera.position.set(0, y, z);

    var draw_meta = [],
        pos = [];
        pos[0] = [5,0,-5];
        pos[1] = [3,3,2];
        pos[2] = [-1,2,0];
        pos[3] = [1,-2,-2];
        pos[4] = [-10,-6,-4];
        pos[5] = [-10,5,-5];
    var draw = function(n){
        var name = '_'+n,
            rotation = (Math.random() * (50 - 1) + 1 | 0) / 10000,
            rot_x = (Math.random() * 12 | 0) / 10,
            rot_y = (Math.random() * 12 | 0) / 10,
            rot_z = (Math.random() * 12 | 0) / 10,
            x = (Math.random() * 10 | 0) - 5,
            y = (Math.random() * 10 | 0) - 5,
            z = (Math.random() * 10 | 0) - 5,
            size = Math.random() * (3 - 1) + 1 | 0;

        var mesh = new THREE.Mesh(
            new THREE.BoxGeometry(size,size,size,8,8),
            new THREE.MeshPhongMaterial({color:0xf8b500,shininess:80})
        );
        draw_meta[name] = {};
        draw_meta[name].rotation = rotation;
        mesh.rotation.x += rot_x;
        mesh.rotation.y += rot_y;
        mesh.rotation.z += rot_z;
        mesh.name = name;
        // mesh.position.set(x,y,z);
        mesh.position.set(pos[n - 1][0],pos[n - 1][1],pos[n - 1][2]);
        scene.add(mesh);



    };

    var i = 0,
        draw_cnt = 6;
    while(i < draw_cnt){
        draw(i + 1);
        i = (i + 1)|0;
    }


    //ライト
    var light_1 = new THREE.DirectionalLight(0xffffff,1.4);
    var light_2 = new THREE.AmbientLight(0xffffff,0.4);
    light_1.position.set(0,100,100);
    scene.add(light_1);
    scene.add(light_2);

    //OrbitControls
    var ctrl = new THREE.OrbitControls(camera,dom);
    ctrl.enableZoom = false;
    ctrl.enablePan = false;

    //背景色
    renderer.setClearColor(0xffffff, 1.0);

    //毎秒描画
    var load = function(){
        scene.traverse(function(obj){
            if(obj instanceof THREE.Mesh === true){
                obj.rotation.x += draw_meta[obj.name].rotation;
                obj.rotation.y += draw_meta[obj.name].rotation;
                obj.rotation.z += draw_meta[obj.name].rotation;
            }
        });

        ctrl.update();
        renderer.render(scene,camera);
        requestAnimationFrame(load);
    };
    load();

    //カメラリセット
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
