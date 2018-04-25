//------------------------------------------------------------------------------
// Event-Service: asynchroner Nachrichtenaustausch
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
let EventService = class {
//------------------------------------------------------------------------------
    constructor () {
        this.queue      = [];
        this.Subscriber = {};
        window.onhashchange = this.send.bind(this);
    }
    send (event) {
        // der hash-Wert interessiert hier nicht
        // gibt es Elemente in der queue?
        if (this.queue.length > 0) {
            let qentry = this.queue[0];
            qentry[0].notify.apply(qentry[0], [qentry[0], qentry[1], qentry[2]]);
            this.queue.shift();
        }
        if (this.queue.length > 0) {
            let d_o = new Date();
            window.location.hash = d_o.getTime();
        }
        event.preventDefault();
        return false;
    }
    subscribe (Subscriber, Message) {
        if (Message in this.Subscriber) {
            // Message bekannt, Liste der Subscriber untersuchen
            if (this.Subscriber[Message].indexOf(Subscriber) == -1) {
                this.Subscriber[Message].push(Subscriber);
            }
        } else {
            // Message noch nicht vorhanden, neu eintragen
            this.Subscriber[Message] = [Subscriber];
        }
    }
    unSubscribe (Subscriber, Message) {
        if (Message in this.Subscriber) {
            // Message bekannt, Liste der Subscriber untersuchen
            let Entry_a = this.Subscriber[Message];
            let index_i = Entry_a.indexOf(Subscriber);
            if (index_i >= 0) {
                // Eintrag entfernen
                Entry_a[index_i] = null;
                Entry_a = this.compact(Entry_a); // compact liefert Kopie!
                if (Entry_a.length == 0) {
                    // keine Subscriber mehr, kann entfernt werden
                    delete this.Subscriber[Message];
                }
            }
        } else {
            // Message nicht vorhanden, falsche Anforderung
        }
    }
    publish (Message, Data) {
        let data = "<null>";
        if ((Data != undefined) && (Data != null)) {
            data = Data.toString();
        }
        console.info('es - publish ' + Message + ' :');
        console.log(Data);
        let that = this;
        this.each(this.Subscriber, function (value, key) {
                // geliefert wird jeweils ein Wert, hier ein Array, und der Key
                if (key == Message) {
                    // an alle Subscriber weitergeben
                    this.each(value, function (entry, index) {
                            // geliefert wird hier das Element und der Index
                            that.queue.push([entry, Message, Data]);
                            let date = new Date();
                            window.location.hash = date.getTime();
                        }, this
                    );
                }
            }, this
        )
    }

    each(object, iterator, context) {
        for (let key in object) {
            iterator.call(context, object[key], key);
        }
    }

    findAll(object, iterator, context) {
        let results = [];
        this.each(object, function(value, index) {
            if (iterator.call(context, value, index))
                results.push(value);
        });
        return results;
    }

    compact(object) {
        return this.findAll(object, function(value_opl) {
            return value_opl != null;
        });
    }


}

module.exports = EventService;