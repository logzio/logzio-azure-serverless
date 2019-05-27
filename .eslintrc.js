module.exports = {
    'rules': {
        "no-underscore-dangle": 0,
        "max-len": [1, {
            code: 121
        }],
        "no-param-reassign": 0,
    },
    'env': {
        node: true,
        jest: true,
        es6: true,
    },
    'extends': [
        'airbnb-base',
    ],
};