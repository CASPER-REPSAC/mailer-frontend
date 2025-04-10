import { writable, derived } from 'svelte/store';

export const createFormStore = (initialValues = {}, validationSchema = {}) => {
  const values = writable(initialValues);
  const touched = writable({});
  const errors = writable({});
  const validate = (currentValues) => {
    const newErrors = {};
    Object.keys(validationSchema).forEach(field => {
      const value = currentValues[field];
      const validators = validationSchema[field];
      for (const validator of validators) {
        const error = validator(value, currentValues);
        if (error) {
          newErrors[field] = error;
          break;
        }
      }
    });
    return newErrors;
  };
  const validateField = (field, value, allValues) => {
    if (!validationSchema[field]) return null;
    for (const validator of validationSchema[field]) {
      const error = validator(value, allValues);
      if (error) return error;
    }
    return null;
  };
  const isValid = derived(errors, $errors => Object.keys($errors).length === 0);
  return {
    values,
    touched,
    errors,
    isValid,
    updateField: (field, value) => {
      values.update(v => ({ ...v, [field]: value }));
      touched.update(t => ({ ...t, [field]: true }));

      values.subscribe(currentValues => {
        const error = validateField(field, value, currentValues);
        errors.update(e => ({ ...e, [field]: error }));
      })();
    },
    validateForm: () => {
      return new Promise(resolve => {
        values.subscribe(currentValues => {
          const newErrors = validate(currentValues);
          errors.set(newErrors);
          resolve(Object.keys(newErrors).length === 0);
        })();
      });
    },
    touchAll: () => {
      values.subscribe(currentValues => {
        const allTouched = Object.keys(currentValues).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        touched.set(allTouched);
      })();
    },
    reset: () => {
      values.set(initialValues);
      touched.set({});
      errors.set({});
    }
  };
};
