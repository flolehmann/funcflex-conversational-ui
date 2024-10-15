const APIS = {
    rasa: {
        url: "YOUR_URL_TO_RASA",
        parser_url: "YOUR_URL_TO_RASA/model/parse"
    },
    t5: {
        url: "YOUR_URL_TO_T5"
    },
    gptneo: {
        url: "YOUR_URL_TO_GPTNEO"
    },
    opus_mt: {
        url: "YOUR_URL_TO_OPUSMT"
    }
};

export const Intent = Object.freeze({
    "SUMMARIZE": "summarize",
    "TRANSLATE": "translate",
    "EXTEND": "extend"
});

export const parseMessage = (message, search) => {
    const value = message.toLowerCase();
    const pattern = `\\B${search}\\b`;
    const regex = new RegExp(pattern);
    const matches = value.match(regex);

    if (matches) {
        return matches;
    }
    return null;
};

export const detectIntent = (message) => {
    return fetch(APIS.rasa.parser_url, {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "text": message,
            "message_id": "b2831e73-1407-4ba0-a861-0f30a42a2a5a"
        })
    })
    .then(response => response.json())
    .then(result => {
        return result;
    });
}

export const summarize = (text) => {
    return fetch(APIS.t5.url, {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "input": text,
            "funcion": "summarization"
        })
    })
    .then(response => response.json())
    .then(result => {
        return result;
    });
}

export const translateDeEn = (text) => {
    console.log("CALLED TRANSLATE_DE_EN");
    return fetch(APIS.opus_mt.url, {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "input": text,
            "function": "translation_de_en"
        })
    })
    .then(response => response.json())
    .then(result => {
        return result;
    });
}

export const translateFrEn = (text) => {
    return fetch(APIS.opus_mt.url, {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "input": text,
            "function": "translation_fr_en"
        })
    })
        .then(response => response.json())
        .then(result => {
            return result;
        });
}

export const generate = (text) => {
    return fetch(APIS.gptneo.url, {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "input": text
        })
    })
        .then(response => response.json())
        .then(result => {
            return result;
        });
}