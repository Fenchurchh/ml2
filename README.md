#ml2

##Installation
This guide assumes you have installed the following software:

* __http://couchdb.org__ 
* __http://nodejs.org__
* __http://nginx.com__ or another http server for static files.

For deployment and building, get these

* __http://npmjs.org__
* __http://kan.so__
* __http://coffeescript.com__

##Network setup
_Making your services accessible at their respective subdomain and on port 80. You can run couchdb and the node server __locally__ or on a __remote__, e.g. virtual machine_

The general setup of ml2 has your couchdb act as the site's http server under the naked second level
domain as well as the www-domain. Its main purposes are hosting a couchapp and thereby serving the 
html markup and answer json queries. 

###Running _locally_
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


###Running on the _network_
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








