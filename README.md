#ml2
this readme is incomplete. stick to the installation.sh for now.

##General setup
A couchdb hosts a couchapp, while static content is being served by a dedicated
server and more complicated interaction is being handled by a node server. 
This is the scheme of how the components are set up:

<table>  
    <thead>
        <tr><th>service</th><th>bound to local ip</th><th>bound to network ip</th><th>answers at</th><th>port</th></tr>
    </thead>
    <tbody>
        <tr><td rowspan="2">couchdb</td><td rowspan="2">127.0.x.1</td><td rowspan="2">192.168.m.X</td><td>http://makellos.tld</td><td>80</td></tr>
        <tr><td>http://www.makellos.tld</td><td>80</td></tr>
        <tr><td>node</td><td>127.0.y.1</td><td>192.168.m.Y</td><td>http://api.makellos.tld</td><td>80</td></tr>
        <tr><td>nginx</td><td>127.0.z.1</td><td>192.168.m.Z</td><td>http://cdn.makellos.tld</td><td>80</td></tr>
    </tbody>
    <tfoot>
        <tr><td>default:</td><td><pre>x=1, y=2, z=3</pre></td></tr>
    </tfoot>
</table>

Notes: 

* `127.0.xyz.1`: Your services need to bind to different _sockets_ (combination of ip and port).
So, to be able to run every service on port `80`, they need to bind to different ip addresses. Every 
`127.0.xyz.1` ip is a valid address of your local loopback interface to bind to. So you can chose x, y and
z to be any integer – just dont make them the same. This guide will assume for the following: `x=1, y=2, z=3`
* `192.168.m.XYZ`: _This is just needed in case you want to access the services over a network – see below._

##Required software
Installe the following software:

* __http://couchdb.org__ 
* __http://nodejs.org__
* __http://nginx.com__ or another http server for static files.
* `curl http://npmjs.org/install.sh | sh` to install the [node package manager](__http://npmjs.org__)
* `npm install -g kanso` to install the couchapp build tools of [kanso](__http://kan.so__). For windows,
see http://kan.so/docs/Installing_on_Windows
* `npm install -g coffee-script` to install the current build system's base, cake.

##Build and deploy process
Right now, building and deployment is done through a __cake__ build file. Have a look at `settings.coffee` 
for detailed configuration. 

* `cake build       ` compiles the raw files
* `cake push        ` deploys everything to the services
* `cake build:push  ` compiles & deploys at once


##Network setup
Bind your services to different ip addresses and make them available at their respective 
domain on port 80. You can have the services running _locally_ or on a _dedicated_ remote 
machine.

##Running couchdb on __127.0.x.1:80__
You have two options:
* __Using futon__
Run the couch service from the command line. It tells you where your couch is listening for
http connections. The default is `http://127.0.0.1:5984`, so adjust the following as needed. 
Open your couch's configuration at `http://127.0.0.1:5984/_utils/config.html` and from the 
section `httpd`, locate the option `port`. 

With a double click on the current port 
(default: `5984`), make it editable and change it to `80`. The couch will very probably be 
be immidiately unavailable. Check `http://127.0.0.1:80` or the console for errors.
* __Changing couchdb's `local.ini`
Open `/etc/couchdb/local.ini` in your editor. Change 

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








