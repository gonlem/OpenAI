<script setup>
import * as Vue from 'vue';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true
});

const ai_request = Vue.ref('');
const ai_response = Vue.ref('');
const ai_model = Vue.ref('gpt-5-nano');
const ai_reasoning_effort = Vue.ref('low'); // "none" | "minimal" | "low" | "medium" | "high"
const ai_service_tier = Vue.ref('default'); // "flex" | "default" | "priority" | "auto"
const ai_temperature = Vue.ref(1.0);
const ai_web_search = Vue.ref('no'); // "yes" | "no"

async function callResponsesApi() {
    try {
        ai_response.value = 'Loading...';
        let startTime = Date.now();
        const response = await openai.responses.create({
            model: ai_model.value,
            reasoning: { effort: ai_reasoning_effort.value },
            input: ai_request.value,
            service_tier: ai_service_tier.value,
            store: true,
            temperature: parseFloat(ai_temperature.value),
            tools: ai_web_search.value === 'yes' ? [{ type: 'web_search' }] : [],
        });
        let endTime = Date.now();
        let responseText = `[Response time: ${(endTime - startTime) / 1000} seconds]\n`;
        responseText += `[Model: ${response.model}]\n`;
        responseText += `[Reasoning effort: ${response.reasoning.effort}]\n`;
        responseText += `[Temperature: ${response.temperature}]\n`;
        responseText += `[Service tier: ${response.service_tier}]\n`;
        responseText += `[Text verbosity: ${response.text.verbosity}]\n`;
        responseText += `[Input tokens: ${response.usage.input_tokens}]\n`;
        responseText += `[Reasoning tokens: ${response.usage.output_tokens_details.reasoning_tokens}]\n`;
        responseText += `[Output tokens: ${(response.usage.output_tokens - response.usage.output_tokens_details.reasoning_tokens)}]\n`;
        responseText += `[Total tokens: ${response.usage.total_tokens}]\n\n`;
        responseText += response.output_text;
        ai_response.value = responseText;
    } catch (error) {
        ai_response.value = `Error: ${error.message}`;
    }

}
</script>

<template>
    <header>
        <div class="header-left">
            <h1 id="title">OpenAI Tools</h1>
        </div>
    </header>
    <main>
        <div class="flex-row">
            <div class="flex-column">
                <label>
                    <span>Request</span>
                    <textarea v-model="ai_request"></textarea>
                </label>
            </div>
            <div class="flex-column fit-content">
                <label>
                    <span>Model</span>
                    <select name="model" v-model="ai_model" required>
                        <option>gpt-5.2</option>
                        <option>gpt-5.1</option>
                        <option>gpt-5</option>
                        <option>gpt-5-mini</option>
                        <option>gpt-5-nano</option>
                    </select>
                </label>
                <label>
                    <span>Effort</span>
                    <select name="reasoning_effort" v-model="ai_reasoning_effort" required>
                        <option>none</option>
                        <option>minimal</option>
                        <option>low</option>
                        <option>medium</option>
                        <option>high</option>
                    </select>
                </label>
                <label>
                    <span>Service Tier</span>
                    <select name="service_tier" v-model="ai_service_tier" required>
                        <option>auto</option>
                        <option>flex</option>
                        <option>default</option>
                        <option>priority</option>
                    </select>
                </label>
                <label>
                    <span>Temperature</span>
                    <input type="number" min="0" max="2" step="0.1" v-model="ai_temperature" />
                </label>
                <label>
                    <span>Web Search</span>
                    <select name="type" v-model="ai_web_search" required>
                        <option>yes</option>
                        <option>no</option>
                    </select>
                </label>
                <button @click="callResponsesApi()">Let's go</button>
            </div>
            <div class="flex-column">
                <label>
                    <span>Response</span>
                    <textarea>{{ ai_response }}</textarea>
                </label>
            </div>
        </div>
    </main>
</template>

<style>
@import "./assets/base.css";

#app {
    min-height: 100vh;
    min-width: fit-content;
    display: grid;
    grid-template-rows: auto 1fr;
}

#app>header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: linear-gradient(to right, hsl(var(--primary-color-h), var(--primary-color-s), 30%), hsl(var(--primary-color-h), var(--primary-color-s), 50%));
    color: white;
    padding: 8px 16px;
}

#app>header #title {
    font-family: sans-serif;
    font-size: 2rem;
    font-weight: normal;
}

#app>main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    gap: 16px;
    background-color: aliceblue;
}

textarea {
    min-width: 100%;
    min-height: 30rem;
    field-sizing: content;
}
</style>