function CurrencyTab() {
    var apiUrl = "http://api.fixer.io/latest?",
        selectedCurrencyKey = "selectedCurrency",
        baseCurrencySelector = "#base-currency",
        dateSelector = "#date",
        ratesSelector = ".rates",
        currencyItemSelector = ".currency-item",
        loaderSelector = ".loader",
        dataItemTemplate = '<div class="currency-item"><p class="currency-name-p">$key</p><p class="currency-value-p">$value</p></div>';

    var storage = new Storage();

    var bindUI = function () {
        var defaultBaseCurrency = storage.getStorage().getItem(selectedCurrencyKey);
        var baseCurrency = defaultBaseCurrency == null ? "USD" : defaultBaseCurrency;
        $(baseCurrencySelector).val(baseCurrency);

        $("#date").datepicker().datepicker("setDate", new Date());
        $("#base-currency").selectmenu({
            change: refreshData
        });
        $("#date").bind("change", function () {
            refreshData();
        });
    }

    var refreshData = function(){
        storage.getStorage().setItem(selectedCurrencyKey, $(baseCurrencySelector).val());
        getCurrencyRates();
    }

    var getCurrencyRates = function () {
        var baseCurrency = $(baseCurrencySelector).val();
        var url = apiUrl + "base=" + baseCurrency + "&date=" + $(dateSelector).val();

        $.ajax({
            url: url,
            method: 'get',
            beforeSend: function () {
                $(loaderSelector).show();
            },
            success: function (data) {
                $(currencyItemSelector).remove();
                createCurrencyItems(data.rates);
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
            complete: function () {
                $(loaderSelector).hide();
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