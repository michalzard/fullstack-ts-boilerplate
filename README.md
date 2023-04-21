# Fullstack ts boilerplate to start that next project you had in mind for a long time.

## Tools

<section align="left">
<img alt="TypeScript" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-plain.svg" />
<img alt="TypeScript" width="30px" style="padding-right:10px;" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg" />
<img alt="React" width="30px" style="padding-right:10px;" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" />
<img alt="Express" width="30px" style="padding-right:10px;" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" />
<img alt="Node" width="30px" style="padding-right:10px;" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-plain.svg" />
<img alt="Css" width="30px" style="padding-right:10px;" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-plain.svg" />
<img alt="Postgresql" width="30px" style="padding-right:10px;" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" />

</section>

## Features

- Scaffolding project to get you to your destination faster.
- React for performant applications
- Tailwindcss for fast and powerfull css out of the box
- Tanstack React Query for ease of querying and caching results
- Postgresql for powerfull and fast sql based database
- http2 express server for multiplexing and faster response time
- vite for performant dev server aswell as bundler
- pnpm for performant packag managing

## Examples inside project

- persistent counter that gets incremented on each page visit
- data loading and caching via tanstack query
- basic auth workflow `Register,Login,Logout,Session`

## How To Start

Project is separated into 2 main folders `website` and `server`.
to start each development environment simply change directory into these folders
like so : `cd website` or `cd server` and to run dev server you can write `pnpm run dev` on both of them.
Website runs on `Vite` and server runs on `Express` that is bridged to `http2` with fallback option to `http1`.<br/><br/><br/>

<img src="./website/public/images/boilerplate.png"/>
