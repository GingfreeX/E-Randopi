<?php
/**
 * Created by Roman Belousov
 * Date: 07.04.16
 */

namespace belousovr\belousovChatBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ButtonType;

class ChatType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                "messageText",
                TextareaType::class,
                array(
                    'label' => 'Текст сообщения',
                    'required' => true,
                    'attr' => array('class' => 'belousovMessageText')
                )
            );

        if ($options['action']) {
            $builder
                ->add(
                    'envoyer',
                    ButtonType::class,
                    array(
                        'attr' => array('class' => 'belousovSendMessage')
                    )
                )
                ->setAction($options['action']);
        }
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            array(
                'data_class' => 'belousovr\belousovChatBundle\Entity\Messages',
            )
        );
    }

    public function getName()
    {
        return 'belousov_chat';
    }
}