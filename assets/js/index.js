function CurrencyTab() {
    var apiUrl = "http://api.fixer.io/latest?",
        resultKey = "currencyRates",
        selectedCurrencyKey = "selectedCurrency"
        baseCurrencySelector = "#base-currency",
        dateSelector = "#date",
        ratesSelector  =".rates",
        dataItemTemplate = '<div class="currency-item">' +
        '<p class="currency-name-p">$key</p>' +
        '<p class="currency-value-p">$value</p>' +
        '</div>'

    var storage = new Storage();

    var bindUI = function () {
        var defaultBaseCurrency = storage.getStorage().getItem(selectedCurrencyKey);
        var baseCurrency = defaultBaseCurrency == null ? "USD" : defaultBaseCurrency;
        $(baseCurrencySelector).val(baseCurrency);
        $(dateSelector).val("2017-08-27");

        $(document).bind("change", function () {
            storage.getStorage().setItem(selectedCurrencyKey, $(baseCurrencySelector).val());
            getCurrencyRates();
        });
    }

    var getCurrencyRates = function () {
        var baseCurrency = $(baseCurrencySelector).val();
        var url = apiUrl + "base=" + baseCurrency + "&date=" + $(dateSelector).val();

        $.ajax({
            url: url,
            method: 'get',
            success: function (data) {
                // $('.rates').find('pre').text(JSON.stringify(data.rates, null, 1));
                $('.currency-item').remove();
                createCurrencyItems(data.rates);
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
            complete: function () {
                // save result to localstorage
                // storage.setItem(resultKey, )
            }
        });
    }

    var createCurrencyItems = function (data) {
        $.each(data, function (key, value) {
            var temp = dataItemTemplate;
            temp = dataItemTemplate.replace("$key", key).replace("$value", value);
            $(ratesSelector).append(temp);
        });
    }

    return {
        init: function () {
            bindUI();
            getCurrencyRates();
        }
    }
}

$(function () {
    var tab = new CurrencyTab();
    tab.init();
});