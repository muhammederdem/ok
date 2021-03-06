import { isFunction, mapFromObject } from "lightdash";
import { getInputElementValue } from "./dom/getInputElementValue";
import { setCustomValidity } from "./dom/setCustomValidity";
/**
 * Ok class.
 *
 * @class
 */
const Ok = class {
    /**
     * Ok constructor.
     *
     * @public
     * @param {object} validators object containing the validators to use.
     * @param {string|boolean} [invalidClass="invalid"] CSS class for invalid elements, or false if none should be set.
     */
    constructor(validators, invalidClass = "invalid") {
        this.map = mapFromObject(validators);
        this.invalidClass = invalidClass;
    }
    /**
     * Validates an input element and returns the validity.
     *
     * @public
     * @param {HTMLInputElement} element HTMLInputElement to validate.
     * @param {Event?} e optional event that triggered validation.
     * @returns {boolean} current validity of the element.
     */
    validate(element, e) {
        if (!element.dataset.ok) {
            throw new Error("No validators are assigned to the element.");
        }
        const validatorList = element.dataset.ok
            .split(",")
            .map(str => str.trim());
        const value = getInputElementValue(element);
        let result = true;
        for (const validatorListEntry of validatorList) {
            if (result) {
                if (!this.map.has(validatorListEntry)) {
                    throw new Error(`Validator '${validatorListEntry}' is not registered.`);
                }
                const validator = this.map.get(validatorListEntry);
                if (!validator.fn(value, element, e)) {
                    result = false;
                    const msg = isFunction(validator.msg)
                        ? validator.msg(value, element, e)
                        : validator.msg;
                    setCustomValidity(element, msg);
                }
            }
        }
        if (result) {
            setCustomValidity(element, "");
            if (this.invalidClass) {
                element.classList.remove(this.invalidClass);
            }
        }
        else if (this.invalidClass) {
            element.classList.add(this.invalidClass);
        }
        return result;
    }
    /**
     * Binds an event handler to an input element.
     *
     * @public
     * @param {HTMLInputElement} element HTMLInputElement to bind.
     * @param {string} [eventType="input"] event type to bind.
     */
    bind(element, eventType = "input") {
        element.addEventListener(eventType, e => this.validate(element, e));
    }
};
export { Ok };
//# sourceMappingURL=Ok.js.map