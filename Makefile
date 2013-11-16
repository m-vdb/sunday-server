ICECAST_CONFIG = config/icecast.xml
ICECAST_PID = log/icecast.pid


.SILENT: start stop

install:
	npm install

# TODO : start node server here too
start:
	icecast -c ${ICECAST_CONFIG} -b

stop:
	kill `cat ${ICECAST_PID}` && echo "Stopped icecast2"

test:
	grunt test