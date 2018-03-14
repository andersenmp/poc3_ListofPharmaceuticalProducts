
class SentryUtils {



    constructor(username){
        var  db = require('../models');
        var Sentry = db.Sentry;

        Sentry.findAll({ where: { login: username } }).then(rows => {
            if(!rows){
                this._sentryFeatures = [];
                this._firstName = username;
                this._lastName = 'Not in Sentry';
                this._email = 'email@not.registred.com';
            }else{
                this._sentryFeatures = rows;
                this._firstName = rows[0].firstName;
                this._lastName = rows[0].lastName;
                this._email = rows[0].email;
            }

        });
    };

    getTotalRows(){
        return this._sentryFeatures.length;
    };
    /**
     * @return mixed
     */
    get firstName() {
        return this._firstName;
    };

    /**
     * @return mixed
     */
    get lastName() {
        return this._lastName;
    };

    /**
     * @return mixed
     */
    get email() {
        return this._email;
    };

   /*hasAccessToFeature($feature){
        if(strpos($feature,'|')){
            $features = explode('|',$feature);
            foreach ($features as $x){
                foreach ($this->sentryFeatures as $item){
                    if(stristr($item->feature, $x)){
                        return true;
                    }
                }
            }
        }else{
            foreach ($this->sentryFeatures as $item){
                if(stristr($item->feature, $feature)){
                    return true;
                }
            }
        }
        return false;

    }*/

};

module.exports = SentryUtils;