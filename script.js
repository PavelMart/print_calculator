document.addEventListener("DOMContentLoaded", () => {
    const {
        printingCost5to9,
        printingCost10to49,
        printingCost50to99,
        printingCost100to199,
        printingCost200to299,
        printingCost300to499,
        printingCost500to,
        foldingCost,
        roundingCost,
        perforationCost,
        curlyPlotterCuttingCost,
        curlyLaserCuttingCost,
        personalizationCost,
        gluePointCost,
        formats,
        paperTypes,
        laminationTypes,
    } = configuration

    const calcBtn = document.getElementById("calculate")
    const resetBtn = document.getElementById("reset")
    const price = document.getElementById("price")
    const priceOne = document.getElementById("price__one")
    const laminationCount = document.getElementById("lamination__count")

    const formatSelect = document.getElementById("format__select")
    const paperSelect = document.getElementById("paper__select")
    const laminationSelect = document.getElementById("lamination__select")
    const foldingSelect = document.getElementById("folding__select")
    const roundingSelect = document.getElementById("rounding__select")
    const perforationSelect = document.getElementById("perforation__select")
    const personalizationSelect = document.getElementById("personalization__select")
    const gluePointSelect = document.getElementById("glue-point__select")

    const formatResult = document.getElementById("format-result")
    const editionResult = document.getElementById("edition-result")
    const paperResult = document.getElementById("paper-result")
    const printingTypeResult = document.getElementById("printing-type-result")
    const laminationResult = document.getElementById("lamination-result")
    const foldingResult = document.getElementById("folding-result")
    const roundingResult = document.getElementById("rounding-result")
    const perforationResult = document.getElementById("perforation-result")
    const curlyCuttingResult = document.getElementById("curly-cutting-result")
    const personalizationResult = document.getElementById("personalization-result")
    const gluePointResult = document.getElementById("glue-point-result")
    const mainResult = document.getElementById("main-result")
    const mainOneResult = document.getElementById("main-one-result")

    const formatTemplate = (elem) => `${elem.formatType}, ${elem.formatWidth}мм x${elem.formatHeight}мм`
    const paperTypeTemplate = (elem) => `${elem.paperType}, ${elem.paperDensity} гр./кв.м.`
    const laminationTypeTemplate = (elem) =>
        elem.value !== "0" && elem.laminationType !== "Soft Touch"
            ? `${elem.laminationType}, ${elem.laminationSize}мкн`
            : `${elem.laminationType}`

    const createOption = (elem, select, format) => {
        const option = document.createElement("option")
        option.textContent = format
        option.value = elem.value
        select.insertAdjacentElement("beforeend", option)
    }

    const createOptionList = (arr, select, template) => {
        arr.forEach((elem) => {
            createOption(elem, select, template(elem))
        })
    }

    const getEdition = () => document.getElementById("edition__value")

    const getOption = (elem) => elem.querySelector(`option[value="${elem.value}"]`)

    const getValue = (elem) => elem.value

    const getSelectData = (arr, select) => {
        const value = getValue(select)

        for (elem of arr) {
            if (elem.value === value) return elem
        }
    }

    const getPrintingPrice = (listCount) => {
        if (listCount >= 5 && listCount <= 9) return +printingCost5to9
        if (listCount >= 10 && listCount <= 49) return +printingCost10to49
        if (listCount >= 50 && listCount <= 99) return +printingCost50to99
        if (listCount >= 100 && listCount <= 199) return +printingCost100to199
        if (listCount >= 200 && listCount <= 299) return +printingCost200to299
        if (listCount >= 300 && listCount <= 499) return +printingCost300to499
        if (listCount >= 500) return +printingCost500to
    }

    const checkSelectData = (select) => (select.value === "0" ? false : true)

    const checkPaper = () => {
        const { paperType } = getSelectData(paperTypes, paperSelect)
        const label1 = document.querySelector("#curly-cutting_1 + label")
        const label2 = document.querySelector("#curly-cutting_2 + label")

        if (paperType === "Самоклеящаяся бумага") {
            label2.style.display = "none"
            label1.style.width = "50%"
        } else {
            label2.style.display = ""
            label1.style.width = ""
        }
    }

    const checkLamination = () => {
        if (checkSelectData(laminationSelect)) {
            laminationCount.disabled = false
            return true
        } else {
            laminationCount.disabled = true
            return false
        }
    }

    const setTextAndPrice = (select, cost, editionValue) => {
        let text = "-"
        let price = 0
        if (checkSelectData(select)) {
            text = select[select.value].textContent
            price = +cost * editionValue
        }
        return { text, price }
    }

    const setEditionValue = () => {
        const { minEdition } = getSelectData(formats, formatSelect, "formatType")
        const editionInput = getEdition()
        editionInput.min = minEdition
        editionInput.value = minEdition
    }

    const setResultTextContent = (elem, text) => (elem.querySelector("#result").textContent = text)

    const renderResult = (
        formatType = null,
        editionValue = null,
        paperValue = null,
        printingTypeText = null,
        foldingText = null,
        roundingText = null,
        perforationText = null,
        curlyCuttingText = null,
        personalizationText = null,
        gluePointText = null,
        result = null,
        resultOne = null,
        laminationText = null
    ) => {
        setResultTextContent(formatResult, formatType)
        setResultTextContent(editionResult, editionValue)
        setResultTextContent(paperResult, paperValue)
        setResultTextContent(printingTypeResult, printingTypeText)
        setResultTextContent(laminationResult, laminationText)
        setResultTextContent(foldingResult, foldingText)
        setResultTextContent(roundingResult, roundingText)
        setResultTextContent(perforationResult, perforationText)
        setResultTextContent(curlyCuttingResult, curlyCuttingText)
        setResultTextContent(personalizationResult, personalizationText)
        setResultTextContent(gluePointResult, gluePointText)
        setResultTextContent(mainResult, result)
        setResultTextContent(mainOneResult, resultOne)
        price.textContent = result
        priceOne.textContent = resultOne
    }

    const reset = () => {
        if (document.querySelector('.item__input_radio[name="curly-cutting"]:checked')) {
            document.querySelector('.item__input_radio[name="curly-cutting"]:checked').checked = false
        }
        renderResult()
    }

    const calculate = () => {
        let printingPrice,
            listPrice,
            laminationPrice = 0,
            listCutPrice = 0,
            curlyCuttingPrice = 0,
            laminationText = "-",
            laminationCountText,
            laminationCountValue

        const { value: formatValue, formatType, layoutOnA3Plus } = getSelectData(formats, formatSelect)
        const { paperType, paperDensity, paperListPrice } = getSelectData(paperTypes, paperSelect)
        const { laminationType, laminationSize, laminationPrices } = getSelectData(laminationTypes, laminationSelect)

        const printingTypeChecked = document.querySelector('.item__input_radio[name="printing-type"]:checked + label')
        const curlyCuttingChecked = document.querySelector('.item__input_radio[name="curly-cutting"]:checked + label')

        const printingTypeBtn = document.querySelector('.item__input_radio[name="printing-type"]:checked')
        const curlyCuttingBtn = document.querySelector('.item__input_radio[name="curly-cutting"]:checked')

        const laminationCount = document.getElementById("lamination__count")

        const printingTypeText = printingTypeChecked.textContent
        const curlyCuttingText = curlyCuttingChecked ? curlyCuttingChecked.textContent : "-"

        const editionValue = getValue(getEdition())
        const printingTypeValue = getValue(printingTypeBtn)
        const curlyCuttingValue = curlyCuttingBtn ? getValue(curlyCuttingBtn) : null

        if (curlyCuttingValue === "1") {
            curlyCuttingPrice = +curlyPlotterCuttingCost
        } else if (curlyCuttingValue === "2") {
            curlyCuttingPrice = +curlyLaserCuttingCost
        }

        if (formatType !== "A3+") {
            listCutPrice = curlyCuttingPrice
        }

        if (checkLamination()) {
            laminationCountValue = getValue(laminationCount)
            laminationCountText = laminationCount[laminationCountValue - 1].textContent
            const elem = { laminationType, laminationSize }
            laminationText = `${laminationTypeTemplate(elem)}, ${laminationCountText}`
            laminationPrice = laminationPrices[formatValue] * laminationCountValue * editionValue
        }

        const { text: foldingText, price: foldingPrice } = setTextAndPrice(foldingSelect, foldingCost, editionValue)
        const { text: roundingText, price: roundingPrice } = setTextAndPrice(roundingSelect, roundingCost, editionValue)
        const { text: perforationText, price: perforationPrice } = setTextAndPrice(
            perforationSelect,
            perforationCost,
            editionValue
        )
        const { text: personalizationText, price: personalizationPrice } = setTextAndPrice(
            personalizationSelect,
            personalizationCost,
            editionValue
        )
        const { text: gluePointText, price: gluePointPrice } = setTextAndPrice(
            gluePointSelect,
            gluePointCost,
            editionValue
        )

        const a3PlusCount = Math.ceil(editionValue / layoutOnA3Plus)

        printingPrice = a3PlusCount * getPrintingPrice(a3PlusCount) * printingTypeValue
        listPrice = a3PlusCount * paperListPrice
        cutPrice = listCutPrice * a3PlusCount

        const result =
            printingPrice +
            listPrice +
            cutPrice +
            laminationPrice +
            foldingPrice +
            roundingPrice +
            perforationPrice +
            personalizationPrice +
            gluePointPrice

        const resultOne = result / editionValue

        renderResult(
            formatType,
            editionValue,
            paperTypeTemplate({ paperType, paperDensity }),
            printingTypeText,
            foldingText,
            roundingText,
            perforationText,
            curlyCuttingText,
            personalizationText,
            gluePointText,
            result.toFixed(2),
            resultOne.toFixed(2),
            laminationText
        )
    }

    resetBtn.addEventListener("click", reset)
    formatSelect.addEventListener("change", setEditionValue)
    paperSelect.addEventListener("change", checkPaper)
    laminationSelect.addEventListener("change", checkLamination)
    calcBtn.addEventListener("click", calculate)

    createOptionList(formats, formatSelect, formatTemplate)
    createOptionList(paperTypes, paperSelect, paperTypeTemplate)
    createOptionList(laminationTypes, laminationSelect, laminationTypeTemplate)
    checkLamination()
})
