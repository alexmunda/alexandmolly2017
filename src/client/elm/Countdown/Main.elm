module Countdown.Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Time exposing (..)
import Date exposing (..)
import Date.Extra.Period exposing (..)
import Date.Extra.Create exposing (dateFromFields)


main : Program Never Model Msg
main =
    Html.program
        { init = ( initialModel, Cmd.none )
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


type Msg
    = Tick Time


type alias Model =
    { weddingDate : Date
    , countdown : DeltaRecord
    }


initialModel : Model
initialModel =
    { weddingDate = initialWeddingDate "2017-10-28"
    , countdown = zeroDelta
    }


initialWeddingDate : String -> Date
initialWeddingDate dateString =
    dateFromFields 2017 Oct 27 0 0 0 0


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick time ->
            ( model |> updateCountdown time, Cmd.none )


updateCountdown : Time -> Model -> Model
updateCountdown now model =
    let
        dateDiff =
            diff model.weddingDate (Date.fromTime now)
    in
        { model | countdown = dateDiff }


countdownCol : String -> Html Msg
countdownCol countdown =
    div [ class "col-xs-4" ]
        [ h1 [ class "countdown-number" ]
            [ text countdown ]
        ]


labelCol : String -> Html Msg
labelCol label =
    div [ class "col-xs-4 countdown-label" ]
        [ text label
        ]


getDays : Int -> Int -> Int
getDays days weeks =
    days + (weeks * 7)


renderCountdown : Model -> Html Msg
renderCountdown model =
    let
        countdown =
            model.countdown

        days =
            getDays countdown.day countdown.week

        hours =
            countdown.hour + 23

        minutes =
            countdown.minute + 59

        pluralize num =
            if num == 1 then
                ""
            else
                "s"

        countDownVal num =
            if countdown.hour == 0 && countdown.minute == 0 && days == 0 then
                "--"
            else
                toString num
    in
        div [ class "countdown-container" ]
            [ div [ class "countdown" ]
                [ div [ class "row" ]
                    [ countdownCol <| countDownVal days
                    , countdownCol <| countDownVal hours
                    , countdownCol <| countDownVal minutes
                    ]
                , div [ class "row" ]
                    [ labelCol <| "Day" ++ pluralize days
                    , labelCol <| "Hour" ++ pluralize hours
                    , labelCol <| "Minute" ++ pluralize minutes
                    ]
                ]
            ]


view : Model -> Html Msg
view model =
    renderCountdown model


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch [ Time.every Time.second Tick ]
