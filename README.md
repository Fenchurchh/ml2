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
the top level domain of the development setup. This can be any non-whitespace string, examples: 
`localhost`, `loc`, `ml`, `tld`, `l`, `vm`. This guide will refer to it as `tld`.
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

##Setting up couchdb
_If couch is running as a service, stop it. It is generally advised that you run couchdb from
the command line on your development machine; this way debugging is much easier._
  
As we want several services listening on port 80, we need to bind each of them to a 
different ip, so that no two services try to bind to the same socket (ip:port combination).
Assuming you run want to run and access your couch locally only, this explains how to 
bind couch to `127.0.1.1:80`

###Binding to port 80 __using futon__  
Run the couch service from the command line. It tells you where your couch is listening for
http connections (the default is <http://127.0.0.1:5984>, so adjust the following as needed). 
Open your couch's configuration at <http://127.0.0.1:5984/_utils/config.html> and locate the 
section `httpd`. 
Doubleclick the current value of the `bind_address` option (default `127.0.0.1`), change it to 
`127.0.1.1` (conforming to the default of this setup) and click the green checkmark to confirm. 
The couch will very probably be immidiately unavailable.  
If all went well however, futon's configuration site should be available at 
<http://127.0.1.1:5984/_utils/config.html>. 
Go there again, and under `httpd`, locate `port`, change it to `80` and click the green 
checkmark to confirm. 
Again, futon should immediately be unresponsive and now be available at <http://127.0.1.1/> 
(leaving out the default port 80). It is very likely, however, that couch exited and you need 
to start it again as sudo, as we are trying to bind to a restricted port (< 1024). So run 

    $ sudo couchdb
    
    Apache CouchDB has started. Time to relax.
    [info] [<0.31.0>] Apache CouchDB has started on http://127.0.1.1:80/

and couchdb should tell you to relax and
that it is listening on <http://127.0.1.1:80>.

###Binding to port 80 through __couchdb's `local.ini`__  
Open `/etc/couchdb/local.ini` in your editor. Under the section `httpd`, change `port` and 
`bind_address` to `80` and `127.0.1.1` respectively. Start couchdb from the command line (via `sudo`);
it should report running on <http://127.0.1.1>.

###Setting up virtual hosts __using futon__  
Go to <http://127.0.1.1/_utils/config.html>, scroll to the bottom and click __Add a new section__. 
Fill in:

    section:    vhosts
    option:     makellos.tld
    value:      /makellos/_design/app/_rewrite
    
Add another section and fill in:

    section:    vhosts
    option:     www.makellos.tld
    value:      /makellos/_design/app/_rewrite

###Setting up virtual hosts __using the command line__  

    curl -X PUT "127.0.1.1/_config/vhosts/makellos.tld" -d '"/makellos/_design/app/_rewrite"'
    curl -X PUT "127.0.1.1/_config/vhosts/www.makellos.tld" -d '"/makellos/_design/app/_rewrite"'

###Creating the databases

    curl -X PUT "127.0.1.1/makellos"
    curl -X PUT "127.0.1.1/inserate"

###Setting the rewriteflag

    curl -X PUT "$couchaddress/_config/httpd/secure_rewrites" -d '"false"'

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








