export default {
    install: Vue => {
        Vue.directive('throttle', {
            inserted: function (el, binding) {
                let event = "click", time = 1000
                let fn = binding.value
                let timer, timer_end;
                el.addEventListener(event, () => {
                    if (timer) {
                        clearTimeout(timer_end);
                        return timer_end = setTimeout(() => fn(), time);
                    }
                    fn();
                    timer = setTimeout(() => timer = null, time)
                })
            }
        })
    }
}