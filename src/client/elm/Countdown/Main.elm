module Countdown.Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Time exposing (..)
import Date exposing (..)
import Date.Extra.Period exposing (..)
import Date.Extra.Create exposing (dateFromFields)


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
    -- Date.fromString dateString |> Result.withDefault (Date.fromTime 0)
    dateFromFields 2017 Oct 28 0 0 0 0


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
    in
        div [ class "countdown-container" ]
            [ div [ class "countdown" ]
                [ div [ class "row" ]
                    [ countdownCol <| toString <| getDays countdown.day countdown.week
                    , countdownCol <| toString <| countdown.hour + 23
                    , countdownCol <| toString <| countdown.minute + 59
                    ]
                , div [ class "row" ]
                    [ labelCol "Days"
                    , labelCol "Hours"
                    , labelCol "Minutes"
                    ]
                ]
            ]


view : Model -> Html Msg
view model =
    renderCountdown model


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch [ Time.every Time.second Tick ]
