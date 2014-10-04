window.fibonacci = function(n) {
    if (n < 2) {
        return 1;
    } else {
        return fibonacci2(n - 2) + fibonacci2(n - 1);
    }
};

window.fibonacci2 = function(n) {
    if (n < 2) {
        return 1;
    } else {
        return fibonacci3(n - 2) + fibonacci3(n - 1);
    }
};

window.fibonacci3 = function(n) {
    if (n < 2) {
        return 1;
    } else {
        return fibonacci4(n - 2) + fibonacci4(n - 1);
    }
};

window.fibonacci4 = function(n) {
    if (n < 2) {
        return 1;
    } else {
        return fibonacci(n - 2) + fibonacci(n - 1);
    }
};