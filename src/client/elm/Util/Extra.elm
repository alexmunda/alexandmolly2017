module Util.Extra exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Form
import Form.Input as Input
import Form.Error
import List.Extra


type alias GroupBuilder a e =
    String -> Form.FieldState e a -> Html Form.Msg


maybeGroupLabel : String -> List (Html a)
maybeGroupLabel label_ =
    if String.isEmpty label_ then
        []
    else
        [ div [ class "col-xs-12" ]
            [ label [ class "control-label" ] [ text label_ ] ]
        ]


errorToString : Form.Error.ErrorValue e -> String
errorToString error =
    case error of
        Form.Error.Empty ->
            "Required"

        Form.Error.InvalidString ->
            "Field is required"

        Form.Error.InvalidEmail ->
            "Invalid email"

        Form.Error.InvalidUrl ->
            "Invalid URL"

        Form.Error.InvalidFormat ->
            "Invalid format"

        Form.Error.InvalidInt ->
            "Value must be a whole number"

        Form.Error.InvalidFloat ->
            "Value must be a decimal"

        Form.Error.InvalidBool ->
            "Must be true or false"

        Form.Error.InvalidDate ->
            "Date must be in the format: MM/DD/YYYY"

        Form.Error.SmallerIntThan x ->
            "Must be greater than " ++ (toString (x - 1))

        Form.Error.GreaterIntThan x ->
            "Must be less than " ++ (toString (x + 1))

        Form.Error.SmallerFloatThan x ->
            "Must be greater than or equal to " ++ (toString x)

        Form.Error.GreaterFloatThan x ->
            "Must be less than or equal to " ++ (toString x)

        Form.Error.ShorterStringThan x ->
            "Must be at least " ++ (toString x) ++ " characters long"

        Form.Error.LongerStringThan x ->
            "Must be no more than " ++ (toString x) ++ " characters long"

        Form.Error.NotIncludedIn ->
            "Invalid option"

        _ ->
            "Error"


errorMessage : Maybe (Form.Error.ErrorValue e) -> Html a
errorMessage maybeError =
    customErrorMessage [] maybeError


customErrorMessage : List ( Form.Error.ErrorValue e, String ) -> Maybe (Form.Error.ErrorValue e) -> Html a
customErrorMessage customMessages maybeError =
    case maybeError of
        Just error ->
            p [ class "help-block" ] <|
                let
                    matchingCustomMessage =
                        List.Extra.find (\( err, message ) -> err == error)
                            customMessages
                            |> Maybe.map Tuple.second
                in
                    [ text <| Maybe.withDefault (errorToString error) matchingCustomMessage ]

        Nothing ->
            span [ class "help-block" ]
                [ text "\x2007" ]


errorClass : Maybe error -> String
errorClass maybeError =
    Maybe.map (\_ -> "has-error") maybeError |> Maybe.withDefault ""


formGroup : String -> Maybe (Form.Error.ErrorValue e) -> List (Html a) -> Html a
formGroup label_ maybeError inputs =
    div [ class ("form-group " ++ (errorClass maybeError)) ] <|
        maybeGroupLabel label_
            ++ [ div [ class "col-xs-12" ]
                    inputs
               , div [ class "col-xs-12" ]
                    [ errorMessage maybeError ]
               ]


focusTextGroup : GroupBuilder String e
focusTextGroup label_ state =
    formGroup label_
        state.liveError
        [ Input.textInput state [ class "form-control", autofocus True ] ]


textGroup : GroupBuilder String e
textGroup label_ state =
    formGroup label_
        state.liveError
        [ Input.textInput state [ class "form-control" ] ]


radioGroup : List ( String, String ) -> GroupBuilder String e
radioGroup options label_ state =
    let
        item ( v, l ) =
            label [ class "radio-inline" ]
                [ Input.radioInput state.path state [ Html.Attributes.value v ]
                , text l
                ]
    in
        formGroup label_
            state.liveError
            (List.map item options)
