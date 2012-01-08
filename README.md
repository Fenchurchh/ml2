#The short version
complete these in order

> get a couch, nginx, node, npm and kanso  
> set up [couchdb](wiki/couchdb)  
> set up [nginx](wiki/nginx)  
> set up [node](wiki/node)  
> set up [network ips](wiki/network-ips) _If you want to have fancy network access to the services_  
> set up [domains](wiki/domains)  
> edit [.kansorc](wiki/kansorc)

Now build and deploy the current code for the frontend

    cd frontend/
    kanso install
    kanso push

And try accessing the couchapp at

__<http://makellos.tld>__

For detailed help, look through the [wiki pages](ml2/wiki/_pages)

***

#The longer version

##Required software
Install the following software:

> __http://couchdb.org__  
> __http://nodejs.org__  
> __http://nginx.com__ or another http server for static files.  
> `curl http://npmjs.org/install.sh | sh` to install the [node package manager](__http://npmjs.org__)  
> `npm install -g kanso` to install the couchapp build tools of [kanso](__http://kan.so__). For windows,
see http://kan.so/docs/Installing_on_Windows  

***

##General setup
The couchdb hosts a couchapp, while static content is being served by a dedicated
server and more complicated interaction is being handled by a node server. Consult the
[wiki](wiki) for setting up the single components and see this scheme of how they 
are set up:

<table>  
    <thead>
        <tr><th>service</th><th>domain (<a href="ml2/wiki/domains">setting up domains</a>)</th><th>bound to socket (<a href="ml2/wiki/ip addresses">setting up ip addresses</a>)</th></tr>
    </thead>
    <tbody>
        <tr><td>couchdb<br /><a href="ml2/wiki/couchdb">setting up couchdb</a></td>
            <td>
                <code>http://makellos.tld</code><br />
                <code>http://www.makellos.tld</code><br />
                <code>http://couch.tld</code> <em>no vhost</em></td>
            <td><code>127.0.1.1 : 80</code> or <code>192.168.m.61 : 80</code></td>
        </tr>
        <tr><td>node<br /><a href="ml2/wiki/node">setting up node</a></td>
            <td><code>http://api.makellos.tld</code></td>
            <td><code>127.0.2.1 : 80</code> or <code>192.168.m.62 : 80</code></td>
        </tr>
        <tr><td>nginx<br /><a href="ml2/wiki/nginx">setting up nginx</a></td>
            <td><code>http://cdn.makellos.tld</code></td>
            <td><code>127.0.3.1 : 80</code> or <code>192.168.m.63 : 80</code></td>
        </tr>
    </tbody>

</table>


##Conventions

* `tld`
the top level domain of the development setup. 

* `http://couch.tld`
For the build system and for convenience, we make couchdb accessible at this domain.

* `127.0.n.1`
Your services need to bind to unique _sockets_ (combination of ip and port).
So, to be able to run every service on the same port (default is 80), they need to [bind to different 
ip addresses](ml2/wiki/ip addresses). Every one of these ips is a valid address of your local loopback 
interface to bind to.

* `192.168.m.n`
You can also [create ip address aliases for you _network interface_](ml2/wiki/network-ips), so that your 
machine will be available under several ip addresses in your local area network.  
_This is just needed in case you want to access the services over a network_

***

##Build and deploy process
Right now, building and deployment is done through kanso. Have a look at [.kansorc](ml2/wiki/kansorc) 
for detailed configuration. 

* `kanso install    ` run this if you updated `kanso.json`
* `kanso push       ` run this to deploy everything to the default couchdb


***

##Running
Access the couchapp at <http://makellos.tld>




