#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const prettier = require("prettier");

const prettierConfig = {
    tabWidth: 4,
    useTabs: false,
    singleQuote: false,
    bracketSpacing: true,
    parser: "typescript"
};

const readRoutes = function() {
    const yamlFile = fs.readFileSync(path.join(__dirname, "../routes.yaml"));
    const yamlContent = yaml.safeLoad(yamlFile);

    const routes = yamlContent.map(item => {
        let { path: routePath, module: moduleName, chunk, exact } = item;
        return {
            routePath,
            moduleName,
            chunk,
            exact,
            componentName: chunk
                .split("")
                .map((item, index) => (index === 0 ? item.toUpperCase() : item))
                .join("")
        };
    });

    return routes;
};

const header = `/**\r\n * Generated on ${new Date().toGMTString()} \r\n * 本文件由routes.yaml模板生成, 请不要直接修改\r\n */\r\n\r\n`;

const genNodeEnvRoutes = () => {
    let codes = [header];
    const routes = readRoutes();
    routes.forEach(route => {
        codes.push(`import ${route.componentName} from "${route.moduleName}";`);
    });

    codes.push(`\r\n\r\nconst routes = [`);
    routes.forEach(route => {
        codes.push(
            `{path: "${route.routePath}", exact: ${route.exact
                ? "true"
                : "false"}, component: ${route.componentName}},`
        );
    });
    codes.push(`];\r\n`);
    codes.push("\r\nexport default routes");

    return prettier.format(codes.join(""), prettierConfig);
};

const genBrowserEnvRoutes = () => {
    let codes = [header];
    const routes = readRoutes();

    codes.push(`const routes = [`);
    routes.forEach(route => {
        codes.push(
            `{path: "${route.routePath}", module: "${route.moduleName}", exact: ${route.exact
                ? "true"
                : "false"}, getComponent(cb){require.ensure(["${route.moduleName}"], require => {/* tslint:disable */\r\ncb && cb(require("${route.moduleName}")["default"]);\r\n/* tslint:enable */}, "${route.chunk}")}},`
        );
    });
    codes.push(`];\r\n`);
    codes.push("\r\nexport default routes");

    return prettier.format(codes.join(""), prettierConfig);
};

const mainGen = () => {
    fs.writeFileSync(
        path.join(__dirname, "../src/server/routes.ts"),
        genNodeEnvRoutes()
    );
    fs.writeFileSync(
        path.join(__dirname, "../src/client/routes.ts"),
        genBrowserEnvRoutes()
    );
};

mainGen();
