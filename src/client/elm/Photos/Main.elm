module Photos.Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


main : Program Never Model Msg
main =
    Html.program
        { init = ( initialModel, Cmd.none )
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }


type Msg
    = PhotoSelected Photo
    | PhotoClosed


type alias Photo =
    { index : Int
    , url : String
    }


type alias Model =
    { selectedPhoto : Maybe Photo
    , photos : List Photo
    }


initialModel : Model
initialModel =
    { photos = List.map createPhoto <| List.range 1 49
    , selectedPhoto = Nothing
    }


createPhoto : Int -> Photo
createPhoto photoId =
    { index = photoId
    , url = buildPhotoUrl photoId
    }


buildPhotoUrl : Int -> String
buildPhotoUrl photoId =
    "/assets/images/photos/" ++ toString photoId ++ ".jpg"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PhotoSelected photo ->
            ( { model | selectedPhoto = Just photo }, Cmd.none )

        PhotoClosed ->
            ( { model | selectedPhoto = Nothing }, Cmd.none )


renderPhotoCol : Photo -> Html Msg
renderPhotoCol photo =
    div [ class "col col-sm-3" ]
        [ div [ class "thumbnail" ]
            [ img [ onClick <| PhotoSelected photo, src photo.url ] []
            ]
        ]


renderPhotoRows : List Photo -> List (Html Msg)
renderPhotoRows photos =
    case photos of
        [] ->
            [ span [] [] ]

        first :: [] ->
            [ div [ class "row" ]
                [ renderPhotoCol first
                ]
            ]

        first :: second :: [] ->
            [ div [ class "row" ]
                [ renderPhotoCol first
                , renderPhotoCol second
                ]
            ]

        first :: second :: third :: [] ->
            [ div [ class "row" ]
                [ renderPhotoCol first
                , renderPhotoCol second
                , renderPhotoCol third
                ]
            ]

        first :: second :: third :: fourth :: rest ->
            [ div [ class "row" ]
                [ renderPhotoCol first
                , renderPhotoCol second
                , renderPhotoCol third
                , renderPhotoCol fourth
                ]
            ]
                ++ renderPhotoRows rest


view : Model -> Html Msg
view model =
    case model.selectedPhoto of
        Just selectedPhoto ->
            div [ class "gallery" ]
                [ div [ class "gallery-closeTarget" ] []
                , div [ class "gallery-content no-grid", style [ ( "width", "800px" ), ( "min-height", "0px" ) ] ]
                    [ button [ class "modal-btn modal-close js-close", onClick PhotoClosed ]
                        [ span [ class "icon icon--close icon--large" ]
                            [ span [ class "visuallyhidden" ] [ text "Close" ]
                            ]
                        ]
                    , div [ class "gallery-media" ]
                        [ img [ class "media-image img img-responsive", src selectedPhoto.url ] []
                        ]
                    , div [ class "galleryNav galleryNav--prev" ]
                        [ span [ class "galleryNav-handle galleryNav-handle--prev" ]
                            [ span [ class "icon icon--caretLeft icon--large" ]
                                [ span [ class "u-hiddenVisually" ] [ text "Previous" ]
                                ]
                            ]
                        ]
                    , div [ class "galleryNav galleryNav--next" ]
                        [ span [ class "galleryNav-handle galleryNav-handle--next" ]
                            [ span [ class "icon icon--caretRight icon--large" ]
                                [ span [ class "u-hiddenVisually" ] [ text "Next" ]
                                ]
                            ]
                        ]
                    ]
                ]

        Nothing ->
            div [ class "container photo-container" ] <| renderPhotoRows model.photos
