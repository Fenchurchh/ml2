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
        <tr><th>service</th><th>answers at</th><th>bound to socket (defaults)</th></tr>
    </thead>
    <tbody>
        <tr><td rowspan="3">couchdb</td>
            <td>http://makellos.tld</td>
            <td rowspan="3"><pre>127.0.1.1 : 80</pre></td>
        </tr>
        <tr><td>http://www.makellos.tld</td></tr>
        <tr><td>http://couch.tld</td></tr>
        <tr><td>node</td>
            <td>http://api.makellos.tld</td>
            <td><pre>127.0.2.1 : 80</pre></td>
        </tr>
        <tr><td>nginx</td>
            <td>http://cdn.makellos.tld</td>
            <td><pre>127.0.3.1 : 80</pre></td>
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


##Running the node api server
Run the following commands

    cd api.makellos
    sudo node run_dev_server.js
    
##Setting up nginx

    server {
        listen  192.168.110.60:80;
        server_name cdn.makellos.vm;
        location / {
                root /home/skiqh/makellos/cdn.makellos.de/;
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


###Accessing the services over the _network_
If you want develop and test on one machine and have the services run on a different, 
maybe even a virtual machine, you need to add alias ip addresses to the ethernet interface 
(not the loopback interface). Basically, you add aliases like this:

    ifconfig eth0:0 192.168.0.6 up
    
For making the aliases permanent, see [this](http://www.cyberciti.biz/faq/linux-creating-or-adding-new-network-alias-to-a-network-card-nic/)
for further reading. 

##
You can run all the node, couch and nginx services on one server under different ports and 
have them respond on port 80 but different sub domains.

First, enable network address translation

    sysctl -w net.ipv4.ip_forward=1
    
You will probably have to restart for this to take effect.
Next, add the proper routes. Assuming your couch 








