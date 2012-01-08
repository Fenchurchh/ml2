#ml2
__this readme is incomplete. use it as an inspirational source__

##Required software
Install the following software:

* __http://couchdb.org__ 
* __http://nodejs.org__
* __http://nginx.com__ or another http server for static files.
* `curl http://npmjs.org/install.sh | sh` to install the [node package manager](__http://npmjs.org__)
* `npm install -g kanso` to install the couchapp build tools of [kanso](__http://kan.so__). For windows,
see http://kan.so/docs/Installing_on_Windows
* `npm install -g coffee-script` to install the current build system's base, cake.

##General setup
The couchdb hosts a couchapp, while static content is being served by a dedicated
server and more complicated interaction is being handled by a node server. 
This is the scheme of how the components are set up:

<table>  
    <thead>
        <tr><th>service</th><th>domain (<a href="ml2/wiki/domains">setting up domains</a>)</th><th>bound to socket (<a href="ml2/wiki/ips">settings up ip addresses</a>)</th></tr>
    </thead>
    <tbody>
        <tr><td>couchdb<br /><a href="ml2/wiki/couchdb">setting up couchdb</a></td>
            <td>
                <code>http://makellos.tld</code><br />
                <code>http://www.makellos.tld</code><br />
                <code>http://couch.tld</code> <strong>no vhost</strong></td>
            <td><code>127.0.1.1 : 80</code></td>
        </tr>
        <tr><td>node<br /><a href="ml2/wiki/node">setting up node</a></td>
            <td><code>http://api.makellos.tld</code></td>
            <td><code>127.0.2.1 : 80</code></td>
        </tr>
        <tr><td>nginx<br /><a href="ml2/wiki/nginx">setting up nginx</a></td>
            <td><code>http://cdn.makellos.tld</code></td>
            <td><code>127.0.3.1 : 80</code></td>
        </tr>
    </tbody>

</table>

Notes: 

* `tld`  
the top level domain of the development setup. This can be any non-whitespace string,  
examples: `localhost`, `loc`, `ml`, `tld`, `l`, `vm`. __This guide will refer to it as `tld`__.
* `http://couch.tld`  
For conveneience, you can make couchdb accessible through `http://couch.tld`, _not to be rewritten
to a couchapp_.
* `127.0.n.1`  
Your services need to bind to unique _sockets_ (combination of ip and port).
So, to be able to run every service on port `80`, they need to bind to different ip addresses. Every 
`127.0.n.1` ip is a valid address of your local loopback interface to bind to. So you can chose n to be 
any integer.
* `192.168.m.n`  
You can also create ip address aliases for you _network interface_, so that your 
machine will be available under several ip addresses in your local area network. 
_This is just needed in case you want to access the services over a network – see below._


##Running couchdb
_See [setting up couchdb](ml2/wiki/couchdb) for how to setup couchdb properly._
It is advised that you run your development couch from the console.

    sudo couchdb

##Running the node api server
Run the following commands

    cd api.makellos
    sudo node run_dev_server.js
    
##Setting up nginx
Edit the file `/etc/nginx/conf.d/virtual.conf` and add a virtual server like so (adjust the path to cdn.makellos.tlb)
    server {
        listen  127.0.3.1:80;
        server_name cdn.makellos.tld;
        location / {
                root /home/username/ml2/cdn.makellos.de/;
        }
    }

##Build and deploy process
Right now, building and deployment is done through a __cake__ build file. Have a look at `settings.coffee` 
for detailed configuration. 

* `cake build       ` compiles the raw files
* `cake push        ` deploys everything to the services
* `cake build:push  ` compiles & deploys at once



##Running

If you just want to develop, test and host the services on the same (local) machine, 
you need to edit your `hosts` file and add some ip aliases to it. Open the file like so:

    sudo vim /etc/hosts

Now, add these lines:

    127.0.1.1       makellos.localhost
    127.0.2.1       www.makellos.localhost
    127.0.3.1       api.makellos.localhost
    127.0.4.1       cdn.makellos.localhost

This points every program trying to lookup these domain names to your local machine. 

Some notes: 

* Any `127.0.x.1` address will point to your loopback interface, the actual 
ip you use for the sub domains doesn't matter.
* `localhost` is assumed to be the "top level domain" we use here. If you wanted to, 
you can change this as well. In the setup of the author, all services run in a virtual machine,
so the setup uses `vm` as the tld, other suggestions are `local`, `loc`, `ml` 
or just `l` (although `local` is not recommended for macintosh networks).










