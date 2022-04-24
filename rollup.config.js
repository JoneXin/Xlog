import babel from 'rollup-plugin-babel'; // ES6 --> ES5
import commonjs from '@rollup/plugin-commonjs'; // 其他 --> ES6
import nodeResolve from '@rollup/plugin-node-resolve'; // 寻找node_modules 中的包
// import { uglify } from 'rollup-plugin-uglify'; //压缩包
import json from '@rollup/plugin-json' // Rollup从JSON文件导入数据
import typescript from 'rollup-plugin-typescript2' //通过配置制定输出格式 的ts 插件
import pkg from './package.json'; // 倒入文件的操作依赖 @rollup/plugin-json 插件

const extensions = ['.js']

// 相关配置plugins
const plugins = [
    nodeResolve({ extensions }),
    commonjs(),
    babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
        extensions // 转换语法
    }),
    typescript(),
    json(),
    // uglify()
];

export default [

    {
        input: 'libs/main.ts',
        external: ['chalk'],
        globals: {
            'chalk': '_'
        },
        output: [
            {
                // name: 'Logger', // 当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下
                file: pkg.dest,
                format: 'cjs', // 各种模块规范通用 兼容AMD和commonJS规范的同时，还兼容全局引用的方式

            },
            {
                // name: 'Logger',
                file: pkg.demo,
                format: 'cjs',
            },
            // {
            //     name: 'logger',
            //     file: pkg.dest,
            //     format: 'esm',
            // },
        ],
        plugins
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify
    // `file` and `format` for each target)
    // {
    //     input: 'libs/main.ts',
    //     external: ['lodash'],
    //     output: [
    //         { file: pkg.main, format: 'cjs' },
    //         { file: pkg.module, format: 'es' }
    //     ],
    //     plugins
    // }
];
