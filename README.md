# Fuse-Box Create React App
 
Create React apps and components with no build configuration, with [FuseBox](http://fuse-box.org).

- [FEBRUARY 2017] Forked from the Facebook Incubator version that to use [FuseBox](http://fuse-box.org) instead of webpack.
- [MARCH 2017] Added equivalent ability to create components instead of apps, with React Storybook pre-integrated for testing / showcasing the use of a component without the need for any additional host app
- [SEPTEMBER 2017] Updated to Fusebox 2.x API
- [FEBRUARY 2018] Updated to Fusebox 3.x API, Babel 7.x, and reforked from latest Facebook non-incubator version

* [Getting Started](#getting-started) – How to create a new app.
* [User Guide](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md) – How to develop apps bootstrapped with Create React App.

Create React App works on macOS, Windows, and Linux.  

## tl;dr

```sh
npm install -g fuse-box-create-react-app

create-react-app my-app
cd my-app/
npm start
```

or using TypeScript

```sh
npm install -g fuse-box-create-react-app

create-react-app my-app --template fuse-box-react-scripts-ts
cd my-app/
npm start
```

or to force using Facebook webpack scripts after installing this version

```sh
npm install -g fuse-box-create-react-app

create-react-app my-app --scripts-version react-scripts 
cd my-app/
npm start
```

or to create a re-usable React Component with demo pages already setup using React Storybook
```sh
npm install -g fuse-box-create-react-app

create-react-component my-component
cd my-component/
npm start
```

Then open [http://localhost:3000/](http://localhost:3000/) to see your app or component.<br>
When you’re ready to deploy to production, create a minified bundle with `npm run build`.

## Motivation

Having a configuration-free build for creating React applications was made easy with the excellent [create-react-app](https://github.com/facebook/create-react-app).    However, builds can take a while on larger projects, and it was hard to do minor configuration changes such as adding in a LESS or SASS preprocessor, without ejecting the configuration.

Also, the underlying builder create-react-app chose was actually the most configurable, which makes it complicated under the covers.  In its provided state it also takes a long time to build for large projects.   Thi

This is a fork of that project that provides a more-configurable, yet still configuration-free experience for the default cases, and only one simple config file for most configuration use cases.

## Features

The enhancements provided by this fork include;
- Very fast builds using fuse-box instead of webpack
- Simple configuration (like additional directories to copy) included in package.json;  no additional files needed
- Advanced configuration for experts provided with a new 'ejectconfig' command which still keeps current with all the latest build scripts, but allows one to override the fuse-box, babel, typescript configurations
- First class support for templates with the `create-react-app --template npm-package-name-here` switch.   This automatically downloads the latest template from the npm repository and shares the same build scripts across all such templates
- First class support for alternative transpilers, such as TypeScript, even substituting for Babel if desired
- First class support for components as well as applications
- Eliminates use of webpack even for libraries such as storybook;   fuse-box / babel or typescript handles it all

## Contributors

This was a quick fork of Facebook's great work to use the very fast FuseBox transpiler. 

If you'd like to take over the project please feel free to request as it's not on our long term roadmap, but there was a gap and we needed it!

### Get Started Immediately

You **don’t** need to install or configure tools like Webpack or Babel.<br>
They are preconfigured and hidden so that you can focus on the code.

Just create a project, and you’re good to go.

## Creating an App

**You’ll need to have Node >= 8 on your local development machine** (but it’s not required on the server). You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to easily switch Node versions between different projects.

To create a new app, run a single command:

```sh
npx fuse-box-create-react-app my-app
```

*([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))*

It will create a directory called `my-app` inside the current folder.<br>
Inside that directory, it will generate the initial project structure and install the transitive dependencies:

```
my-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   └── favicon.ico
│   └── index.html
│   └── manifest.json
└── src
    └── App.css
    └── App.js
    └── App.test.js
    └── index.css
    └── index.js
    └── logo.svg
    └── registerServiceWorker.js
```

No configuration or complicated folder structures, just the files you need to build your app.<br>
Once the installation is done, you can open your project folder:

```sh
cd my-app
```

Inside the newly created project, you can run some built-in commands:

### `npm start` or `yarn start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

<p align='center'>
<img src='https://cdn.rawgit.com/marionebl/create-react-app/9f62826/screencast-error.svg' width='600' alt='Build errors'>
</p>

### `npm test` or `yarn test`

Runs the test watcher in an interactive mode.<br>
By default, runs tests related to files changed since the last commit.

[Read more about testing.](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#running-tests)

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
By default, it also [includes a service worker](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#making-a-progressive-web-app) so that your app loads from local cache on future visits.

Your app is ready to be deployed.

## User Guide

The [User Guide](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md) includes information on different topics, such as:

- [Updating to New Releases](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#updating-to-new-releases)
- [Folder Structure](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#folder-structure)
- [Available Scripts](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#available-scripts)
- [Supported Browsers](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#supported-browsers)
- [Supported Language Features and Polyfills](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#supported-language-features-and-polyfills)
- [Syntax Highlighting in the Editor](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#syntax-highlighting-in-the-editor)
- [Displaying Lint Output in the Editor](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#displaying-lint-output-in-the-editor)
- [Formatting Code Automatically](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#formatting-code-automatically)
- [Debugging in the Editor](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#debugging-in-the-editor)
- [Changing the Page `<title>`](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#changing-the-page-title)
- [Installing a Dependency](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#installing-a-dependency)
- [Importing a Component](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#importing-a-component)
- [Code Splitting](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#code-splitting)
- [Adding a Stylesheet](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#adding-a-stylesheet)
- [Post-Processing CSS](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#post-processing-css)
- [Adding a CSS Preprocessor (Sass, Less etc.)](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#adding-a-css-preprocessor-sass-less-etc)
- [Adding Images, Fonts, and Files](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#adding-images-fonts-and-files)
- [Using the `public` Folder](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#using-the-public-folder)
- [Using Global Variables](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#using-global-variables)
- [Adding Bootstrap](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#adding-bootstrap)
- [Adding Flow](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#adding-flow)
- [Adding a Router](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#adding-a-router)
- [Adding Custom Environment Variables](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#adding-custom-environment-variables)
- [Can I Use Decorators?](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#can-i-use-decorators)
- [Fetching Data with AJAX Requests](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#fetching-data-with-ajax-requests)
- [Integrating with an API Backend](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#integrating-with-an-api-backend)
- [Proxying API Requests in Development](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#proxying-api-requests-in-development)
- [Using HTTPS in Development](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#using-https-in-development)
- [Generating Dynamic `<meta>` Tags on the Server](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#generating-dynamic-meta-tags-on-the-server)
- [Pre-Rendering into Static HTML Files](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#pre-rendering-into-static-html-files)
- [Running Tests](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#running-tests)
- [Debugging Tests](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#debugging-tests)
- [Developing Components in Isolation](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#developing-components-in-isolation)
- [Publishing Components to npm](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#publishing-components-to-npm)
- [Making a Progressive Web App](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#making-a-progressive-web-app)
- [Analyzing the Bundle Size](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#analyzing-the-bundle-size)
- [Deployment](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#deployment)
- [Advanced Configuration](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#advanced-configuration)
- [Troubleshooting](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#troubleshooting)

A copy of the user guide will be created as `README.md` in your project folder.

## How to Update to New Versions?

Please refer to the [User Guide](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#updating-to-new-releases) for this and other information.

## Philosophy

* **One Dependency:** There is just one build dependency. It uses Webpack, Babel, ESLint, and other amazing projects, but provides a cohesive curated experience on top of them.

* **No Configuration Required:** You don't need to configure anything. Reasonably good configuration of both development and production builds is handled for you so you can focus on writing code.

* **No Lock-In:** You can “eject” to a custom setup at any time. Run a single command, and all the configuration and build dependencies will be moved directly into your project, so you can pick up right where you left off.

## What’s Included?

Your environment will have everything you need to build a modern single-page React app:

* React, JSX, ES6, and optionally TypeScript syntax support.
* Language extras beyond ES6 like the object spread operator.
* Autoprefixed CSS, so you don’t need `-webkit-` or other prefixes.
* A fast interactive unit test runner with built-in support for coverage reporting.
* A live development server that warns about common mistakes.
* A build script to bundle JS, CSS, and images for production, with hashes and sourcemaps.
* An offline-first [service worker](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers) and a [web app manifest](https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/), meeting all the [Progressive Web App](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#making-a-progressive-web-app) criteria.
* Hassle-free updates for the above tools with a single dependency.

Check out [this guide](https://github.com/nitishdayal/cra_closer_look) for an overview of how these tools fit together.

The tradeoff is that **these tools are preconfigured to work in a specific way**. If your project needs more customization, you can ["eject"](https://github.com/offgridnetworks/fuse-box-create-react-app/blob/master/packages/fuse-box-react-scripts/template/README.md#npm-run-eject) and customize it, but then you will need to maintain this configuration.

## Popular Alternatives

Create React App is a great fit for:

* **Learning React** in a comfortable and feature-rich development environment.
* **Starting new single-page React applications.**
* **Creating examples** with React for your libraries and components.

Here’s a few common cases where you might want to try something else:

* If you want to **try React** without hundreds of transitive build tool dependencies, consider [using a single HTML file or an online sandbox instead](https://reactjs.org/docs/try-react.html).

* If you need to **integrate React code with a server-side template framework** like Rails or Django, or if you’re **not building a single-page app**, consider using [nwb](https://github.com/insin/nwb), or [Neutrino](https://neutrino.js.org/) which are more flexible. For Rails specifically, you can use [Rails Webpacker](https://github.com/rails/webpacker).

* If you need to **publish a React component**, [nwb](https://github.com/insin/nwb) can [also do this](https://github.com/insin/nwb#react-components-and-libraries), as well as [Neutrino's react-components preset](https://neutrino.js.org/packages/react-components/).

* If you want to do **server rendering** with React and Node.js, check out [Next.js](https://github.com/zeit/next.js/) or [Razzle](https://github.com/jaredpalmer/razzle). Create React App is agnostic of the backend, and just produces static HTML/JS/CSS bundles.

* If your website is **mostly static** (for example, a portfolio or a blog), consider using [Gatsby](https://www.gatsbyjs.org/) instead. Unlike Create React App, it pre-renders the website into HTML at the build time.

* If you want to use **TypeScript**, consider using [create-react-app-typescript](https://github.com/wmonk/create-react-app-typescript).

* Finally, if you need **more customization**, check out [Neutrino](https://neutrino.js.org/) and its [React preset](https://neutrino.js.org/packages/react/).

All of the above tools can work with little to no configuration.

If you prefer configuring the build yourself, [follow this guide](https://reactjs.org/docs/add-react-to-an-existing-app.html).

## Contributing

We'd love to have your helping hand on `create-react-app`! See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on what we're looking for and how to get started.

## React Native

Looking for something similar, but for React Native?<br>
Check out [Create React Native App](https://github.com/react-community/create-react-native-app/).

## Acknowledgements

We are grateful to the authors of existing related projects for their ideas and collaboration:

* [@eanplatter](https://github.com/eanplatter)
* [@insin](https://github.com/insin)
* [@mxstbr](https://github.com/mxstbr)
