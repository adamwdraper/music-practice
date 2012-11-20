var Appular = Appular || {};

// Define apps here
Appular.apps = {
    exercise: function(element) {
        if(require) {
            require([
                'apps/common/app',
                'apps/exercise/app'
            ], function(Common, Exercise) {
                Exercise.initialize(element);
            });
        }
    }
};