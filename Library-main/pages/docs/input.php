<div class="container flex w-full h-full  justify-center">
    <form action="" class="cc-form flex flex-col gap-3 w-3/5 " id="testForm">

        <div class="cc-field">
            <label for="input_text" class="cc-label"><?php echo __('form/field/text_input/label')?></label>
            <input class="cc-input" type="text" id="input_text" name="input_text"
                placeholder="<?php echo __('form/field/text_input/placeholder')?>" />
        </div>

        <div class="cc-field">
            <label for="input_email" class="cc-label"><?php echo __('form/field/email/label')?> </label>
            <input class="cc-input" type="email" id="input_email" name="input_email"
                placeholder="<?php echo __('form/field/email/placeholder')?>" />
        </div>
        <div class="cc-field">
            <label for="input_password" class="cc-label"><?php echo __('form/field/password/label')?></label>
            <input class="cc-input" type="password" id="input_password" name="input_password"
                placeholder="<?php echo __('form/field/password/placeholder')?>" />
        </div>
        <div class="cc-field">
            <label for="input_password_conf"
                class="cc-label"><?php echo __('form/field/password_confirm/label')?></label>
            <input class="cc-input" type="password" id="input_password_conf" name="input_password_conf"
                placeholder="<?php echo __('form/field/password_confirm/placeholder')?>" />
        </div>
        <div class="cc-field">
            <label for="input_file" class="cc-label"><?php echo __('form/field/file/label')?> </label>
            <input class="cc-input" type="file" id="input_file" name="input_file"
                placeholder="<?php echo __('form/field/file/placeholder')?>" />
        </div>
        <div class="cc-field">
            <label for="input_tel" class="cc-label"><?php echo __('form/field/Phone/label')?></label>
            <input class="cc-input" type="tel" id="input_tel" name="input_tel"
                placeholder="<?php echo __('form/field/Phone/placeholder')?>" />
        </div>
        <div class="cc-field">
            <label for="input_date" class="cc-label"><?php echo __('form/field/date/label')?></label>
            <input class="cc-input" type="date" id="input_date" name="input_date"
                placeholder="<?php echo __('form/field/date/placeholder')?>" />
        </div>
        <div class="cc-field">
            <label for="select_input" class="cc-label"></label>
            <select class='cc-input' id="select_input" name="select_input">
                <option value="option1"><?php echo __('form/field/select/options/1')?></option>
                <option value="option2"><?php echo __('form/field/select/options/2')?></option>
                <option value="option3"><?php echo __('form/field/select/options/3')?></option>
            </select>
        </div>
        <button class='cc-button cc-button_primary cc-button_lg w-full mt-4'
            type="submit"><?php echo __('form/button_text')?></button>

    </form>
</div>
<?php
            $errorMessages = [
                'input_textRequired' => __('form/error/required', [
                    "field" => __('form/field/text_input/label')
                ]),
                'input_textMinLength' => __('form/error/min', [
                    "field" => __('form/field/text_input/label'),
                    "minLength" => 3
                ]),
                'input_textMaxLength' => __('form/error/max', [
                    "field" => __('form/field/text_input/label'),
                    "maxLength" => 32
                ]),

                'emailRequired' => __('form/error/required', [
                    "field" => __('form/field/email/label')
                ]),
                'emailInvalid' => __('form/error/email', [
                    "field" => __('form/field/email/label')
                ]),

                'passwordRequired' => __('form/error/required', [
                    "field" => __('form/field/password/label')
                ]),
                'passwordMinLength' => __('form/error/min', [
                    "field" => __('form/field/password/label'),
                    "minLength" => 8
                ]),
                'passwordMaxLength' => __('form/error/max', [
                    "field" => __('form/field/password/label'),
                    "maxLength" => 32
                ]),
                'passwordConfirmRequired' => __('form/error/required', [
                    "field" => __('form/field/password_confirm/label')
                ]),
                'passwordConfirmMatch' => __('form/error/password_confirm', [
                    "field" => __('form/field/password_confirm/label'),
                    "match" => __('form/field/password/label')
                ])
            ];

            echo "<script type='text/javascript'>\n";
            foreach ($errorMessages as $key => $value) {
                echo "const {$key}Error = " . json_encode($value) . ";\n";
            }
            echo "</script>\n";
            ?>
<script type='module'>
import {
    FormValidator
} from './ui/index.js';
document.addEventListener('DOMContentLoaded', () => {
    const TestForm = document.getElementById('testForm');
    const formValidator = new FormValidator(TestForm);

    formValidator.validator('input_text', [{
            type: 'required',
            message: input_textRequiredError
        },
        {
            type: 'minLength',
            minLength: 3,
            message: input_textMinLengthError
        },
        {
            type: 'maxLength',
            maxLength: 32,
            message: input_textMaxLengthError
        }
    ]);

    formValidator.validator('input_email', [{
            type: 'required',
            message: emailRequiredError
        },
        {
            type: 'email',
            message: emailInvalidError
        }
    ]);

    formValidator.validator('input_password', [{
            type: 'required',
            message: passwordRequiredError
        },
        {
            type: 'password',
            minLength: 8,
            message: {
                min: passwordMinLengthError,
                max: passwordMaxLengthError
            }
        },
    ]);
    formValidator.validator('input_password_conf', [{
            type: 'required',
            message: passwordConfirmRequiredError
        },
        (value, values) => {
            if (value !== values.input_password) {
                return passwordConfirmMatchError;
            }
            return true;
        }
    ]);

    formValidator.onSubmit((values) => {
        fetch(registrationForm.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }).then(data => {
            window.location.href = data.redirect;
        }).catch(error => {
            console.log(error.message);
        });
    })
})
</script>