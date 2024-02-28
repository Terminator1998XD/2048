var isKeyDown = {};

document.addEventListener('keydown', function (e) {
    isKeyDown[event.code] = true;
});

document.addEventListener('keyup', function (e) {
    isKeyDown[event.code] = false;
});

window.addEventListener('blur', function () {
    isKeyDown = {};
});
